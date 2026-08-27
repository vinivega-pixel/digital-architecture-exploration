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

SYSTEM = (
    'Ты — инженер-консультант цифрового института «ЦИФРА». Помогаешь по этапу строительного проекта. '
    'Отвечай по-русски, кратко и по делу, ссылайся на действующие нормы РФ (СП, ГОСТ, ГрК РФ, ПП РФ № 87). '
    'Задавай уточняющие вопросы об объекте: площадь, этажность, регион, класс ответственности, исходные документы. '
    'Если пользователь описывает свои документы — разбери их состав, укажи, каких данных не хватает и где возможны противоречия. '
    'Не выдумывай номера пунктов, которых не знаешь. Не более 200 слов в ответе.'
)


def handler(event: dict, context) -> dict:
    """Чат с ИИ-инженером по этапу проекта: диалог, разбор исходных данных, ссылки на нормы."""
    method = event.get('httpMethod', 'GET')

    if method == 'OPTIONS':
        return {'statusCode': 200, 'headers': CORS, 'body': ''}

    if method != 'POST':
        return {'statusCode': 405, 'headers': CORS, 'body': json.dumps({'error': 'Method not allowed'})}

    body = json.loads(event.get('body') or '{}')
    messages = body.get('messages') or []
    stage = body.get('stage') or ''

    if not messages:
        return {'statusCode': 400, 'headers': CORS, 'body': json.dumps({'error': 'messages required'})}

    messages = messages[-12:]
    system = SYSTEM + (f' Текущий этап проекта: «{stage}».' if stage else '')

    payload = {
        'model': 'llama-3.3-70b-versatile',
        'messages': [{'role': 'system', 'content': system}] + [
            {'role': m.get('role', 'user'), 'content': str(m.get('content', ''))[:4000]} for m in messages
        ],
        'temperature': 0.4,
        'max_tokens': 700,
    }

    key = os.environ.get('GROQ_API_KEY', '')
    if not key:
        return {
            'statusCode': 200,
            'headers': CORS,
            'body': json.dumps({
                'reply': 'Чат ещё не активирован: не добавлен ключ доступа к языковой модели. '
                         'Добавьте секрет GROQ_API_KEY в настройках проекта — и агент заработает.',
                'configured': False,
            }, ensure_ascii=False),
        }

    req = urllib.request.Request(
        'https://api.groq.com/openai/v1/chat/completions',
        data=json.dumps(payload).encode('utf-8'),
        headers={'Content-Type': 'application/json', 'Authorization': f'Bearer {key}'},
        method='POST',
    )

    try:
        with urllib.request.urlopen(req, timeout=25) as resp:
            data = json.loads(resp.read().decode('utf-8'))
        reply = data['choices'][0]['message']['content']
    except urllib.error.HTTPError as e:
        detail = e.read().decode('utf-8')[:300]
        return {'statusCode': 502, 'headers': CORS, 'body': json.dumps({'error': 'llm_error', 'detail': detail}, ensure_ascii=False)}
    except Exception as e:
        return {'statusCode': 502, 'headers': CORS, 'body': json.dumps({'error': 'llm_unavailable', 'detail': str(e)[:200]}, ensure_ascii=False)}

    return {'statusCode': 200, 'headers': CORS, 'body': json.dumps({'reply': reply, 'configured': True}, ensure_ascii=False)}
