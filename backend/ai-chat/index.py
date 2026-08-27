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
    'Ты — инженер-консультант цифрового института «ЦИФРА». Помогаешь по этапу строительного проекта. '
    'Отвечай по-русски, кратко и по делу, ссылайся на действующие нормы РФ (СП, ГОСТ, ГрК РФ, ПП РФ № 87). '
    'Задавай уточняющие вопросы об объекте: площадь, этажность, регион, класс ответственности, исходные документы. '
    'Если пользователь описывает свои документы — разбери их состав, укажи, каких данных не хватает и где возможны противоречия. '
    'Не выдумывай номера пунктов, которых не знаешь. Не более 200 слов в ответе.'
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

    if not PROVIDERS:
        return {
            'statusCode': 200,
            'headers': CORS,
            'body': json.dumps({
                'reply': 'Сервис ещё не активирован: не добавлен ключ доступа к языковой модели.',
                'configured': False,
            }, ensure_ascii=False),
        }

    messages = messages[-12:]
    system = SYSTEM + (f' Текущий этап проекта: «{stage}».' if stage else '')

    payload = {
        'messages': [{'role': 'system', 'content': system}] + [
            {'role': m.get('role', 'user'), 'content': str(m.get('content', ''))[:4000]} for m in messages
        ],
        'temperature': 0.4,
        'max_tokens': 700,
    }

    reply = ask_llm(payload)

    if not reply:
        return {
            'statusCode': 200,
            'headers': CORS,
            'body': json.dumps({
                'reply': 'Агент временно недоступен. Пополните баланс DeepSeek или добавьте бесплатный ключ GROQ_API_KEY в настройках проекта.',
                'configured': False,
            }, ensure_ascii=False),
        }

    return {'statusCode': 200, 'headers': CORS, 'body': json.dumps({'reply': reply, 'configured': True}, ensure_ascii=False)}
