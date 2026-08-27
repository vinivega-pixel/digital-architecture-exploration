import json
import os
import urllib.request
import urllib.error

CORS = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, X-User-Id, X-Auth-Token, X-Session-Id',
    'Access-Control-Max-Age': '86400',
    'Content-Type': 'application/json',
}

DEEPSEEK_KEY = os.environ.get('DEEPSEEK_API_KEY', '')
GROQ_KEY = os.environ.get('GROQ_API_KEY', '')
USE_DEEPSEEK = bool(DEEPSEEK_KEY)
API_URL = 'https://api.deepseek.com/chat/completions' if USE_DEEPSEEK else 'https://api.groq.com/openai/v1/chat/completions'
MODEL = 'deepseek-chat' if USE_DEEPSEEK else 'llama-3.3-70b-versatile'

SYSTEM = (
    'Ты — нормоконтролёр цифрового института «ЦИФРА». Отвечаешь на вопросы о строительных нормах России. '
    'Структура ответа строго такая:\n'
    '1) ОТВЕТ — прямой ответ на вопрос, 2-4 предложения.\n'
    '2) ОСНОВАНИЕ — конкретные документы: номер свода правил, ГОСТа, статьи кодекса или постановления, '
    'с указанием пункта или таблицы, если уверен в номере.\n'
    '3) КАК ПРИМЕНЯТЬ — что это значит для проекта на практике, 1-3 предложения.\n'
    'Ссылайся только на действующие документы РФ: ГрК РФ, ЗК РФ, ФЗ № 384-ФЗ, ФЗ № 123-ФЗ, ПП РФ № 87, '
    'своды правил СП, ГОСТ, СанПиН, РД-11-02-2006. Если не уверен в номере пункта — назови документ без пункта '
    'и честно скажи, что точный пункт надо сверить в действующей редакции. Не выдумывай номера. '
    'Отвечай по-русски, не более 250 слов.'
)


def handler(event: dict, context) -> dict:
    """Автопроверка по нормам: вопрос пользователя и ответ с юридическим обоснованием со ссылкой на документы."""
    method = event.get('httpMethod', 'GET')

    if method == 'OPTIONS':
        return {'statusCode': 200, 'headers': CORS, 'body': ''}

    if method != 'POST':
        return {'statusCode': 405, 'headers': CORS, 'body': json.dumps({'error': 'Method not allowed'})}

    body = json.loads(event.get('body') or '{}')
    question = str(body.get('question') or '').strip()
    stage = body.get('stage') or ''

    if not question:
        return {'statusCode': 400, 'headers': CORS, 'body': json.dumps({'error': 'question required'})}

    system = SYSTEM + (f' Вопрос задан на этапе проекта «{stage}».' if stage else '')

    payload = {
        'model': MODEL,
        'messages': [
            {'role': 'system', 'content': system},
            {'role': 'user', 'content': question[:2000]},
        ],
        'temperature': 0.2,
        'max_tokens': 800,
    }

    key = DEEPSEEK_KEY or GROQ_KEY
    if not key:
        return {
            'statusCode': 200,
            'headers': CORS,
            'body': json.dumps({
                'answer': 'Проверка по нормам ещё не активирована: не добавлен ключ доступа к языковой модели. Добавьте секрет DEEPSEEK_API_KEY в настройках проекта — и сервис заработает.',
                'configured': False,
            }, ensure_ascii=False),
        }

    req = urllib.request.Request(
        API_URL,
        data=json.dumps(payload).encode('utf-8'),
        headers={'Content-Type': 'application/json', 'Authorization': f'Bearer {key}'},
        method='POST',
    )

    try:
        with urllib.request.urlopen(req, timeout=25) as resp:
            data = json.loads(resp.read().decode('utf-8'))
        answer = data['choices'][0]['message']['content']
    except urllib.error.HTTPError as e:
        detail = e.read().decode('utf-8')[:300]
        if e.code in (401, 402, 403):
            return {
                'statusCode': 200,
                'headers': CORS,
                'body': json.dumps({'answer': 'Проверка временно недоступна: ключ доступа к языковой модели не принят. Проверьте секрет DEEPSEEK_API_KEY в настройках проекта.', 'configured': False}, ensure_ascii=False),
            }
        return {'statusCode': 502, 'headers': CORS, 'body': json.dumps({'error': 'llm_error', 'detail': detail}, ensure_ascii=False)}
    except Exception as e:
        return {'statusCode': 502, 'headers': CORS, 'body': json.dumps({'error': 'llm_unavailable', 'detail': str(e)[:200]}, ensure_ascii=False)}

    return {'statusCode': 200, 'headers': CORS, 'body': json.dumps({'answer': answer, 'configured': True}, ensure_ascii=False)}
