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

PROVIDERS = []
if DEEPSEEK_KEY:
    PROVIDERS.append(('https://api.deepseek.com/chat/completions', 'deepseek-chat', DEEPSEEK_KEY))
if GROQ_KEY:
    PROVIDERS.append(('https://api.groq.com/openai/v1/chat/completions', 'llama-3.3-70b-versatile', GROQ_KEY))

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


def ask_llm(payload: dict) -> str:
    for url, model, key in PROVIDERS:
        body = dict(payload, model=model)
        req = urllib.request.Request(
            url,
            data=json.dumps(body).encode('utf-8'),
            headers={'Content-Type': 'application/json', 'Authorization': f'Bearer {key}'},
            method='POST',
        )
        try:
            with urllib.request.urlopen(req, timeout=25) as resp:
                data = json.loads(resp.read().decode('utf-8'))
            return data['choices'][0]['message']['content']
        except urllib.error.HTTPError as e:
            print(f'LLM {url} -> {e.code} {e.read().decode("utf-8")[:200]}')
        except Exception as e:
            print(f'LLM {url} -> {str(e)[:200]}')
    return ''


def handler(event: dict, context) -> dict:
    """Автопроверка по нормам: ответ на вопрос с юридическим обоснованием и порядком применения."""
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

    if not PROVIDERS:
        return {
            'statusCode': 200,
            'headers': CORS,
            'body': json.dumps({
                'answer': 'Сервис ещё не активирован: не добавлен ключ доступа к языковой модели.',
                'configured': False,
            }, ensure_ascii=False),
        }

    system = SYSTEM + (f' Вопрос задан на этапе проекта «{stage}».' if stage else '')

    payload = {
        'messages': [
            {'role': 'system', 'content': system},
            {'role': 'user', 'content': question[:2000]},
        ],
        'temperature': 0.2,
        'max_tokens': 800,
    }

    answer = ask_llm(payload)

    if not answer:
        return {
            'statusCode': 200,
            'headers': CORS,
            'body': json.dumps({
                'answer': 'Проверка временно недоступна. Пополните баланс DeepSeek или добавьте бесплатный ключ GROQ_API_KEY в настройках проекта.',
                'configured': False,
            }, ensure_ascii=False),
        }

    return {'statusCode': 200, 'headers': CORS, 'body': json.dumps({'answer': answer, 'configured': True}, ensure_ascii=False)}
