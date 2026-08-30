import json
import os
import urllib.error
import urllib.request

DEEPSEEK_KEY = os.environ.get('DEEPSEEK_API_KEY', '')
GROQ_KEY = os.environ.get('GROQ_API_KEY', '') or os.environ.get('API_KEY', '')

PROVIDERS = []
if DEEPSEEK_KEY:
    PROVIDERS.append(('https://api.deepseek.com/chat/completions', 'deepseek-chat', DEEPSEEK_KEY))
if GROQ_KEY:
    PROVIDERS.append(('https://api.groq.com/openai/v1/chat/completions', 'llama-3.3-70b-versatile', GROQ_KEY))

ROLES = {
    'analyst': (
        'Ты — аналитик института «ЦИФРА». По описанию объекта готовишь техническое задание. '
        'Отвечай строго JSON без пояснений: {"title": "...", "summary": "...", '
        '"rows": [{"param": "...", "value": "..."}], "norms": ["СП ..."], "questions": ["..."]}. '
        'Параметров 6-12: назначение, площадь, этажность, конструктив, сети, класс ответственности, регион. '
        'Нормы — только действующие документы РФ, которые точно знаешь.'
    ),
    'architect': (
        'Ты — архитектор института «ЦИФРА». По ТЗ предлагаешь варианты планировки. '
        'Отвечай строго JSON: {"variants": [{"name": "...", "idea": "...", "footprint": "12x10 м", '
        '"floors": 2, "area": 240, "rooms": [{"name": "Гостиная", "area": 28}], "pros": "...", "cons": "..."}]}. '
        'Ровно 8 разных вариантов, площади реалистичные и согласованы с общей площадью.'
    ),
    'estimator': (
        'Ты — сметчик института «ЦИФРА». Считаешь ориентировочную стоимость. '
        'Отвечай строго JSON: {"currency": "RUB", "regionK": 1.0, "items": [{"name": "...", "unit": "м3", '
        '"qty": 0, "price": 0, "sum": 0}], "total": 0, "note": "..."}. '
        'Разделы: земляные, фундамент, каркас, кровля, фасад, отделка, инженерные сети. Цены — рынок РФ.'
    ),
}


def ask(payload: dict) -> str:
    for url, model, key in PROVIDERS:
        body = dict(payload, model=model)
        req = urllib.request.Request(
            url,
            data=json.dumps(body).encode('utf-8'),
            headers={'Content-Type': 'application/json', 'Authorization': f'Bearer {key}'},
            method='POST',
        )
        try:
            with urllib.request.urlopen(req, timeout=40) as resp:
                data = json.loads(resp.read().decode('utf-8'))
            return data['choices'][0]['message']['content']
        except urllib.error.HTTPError as e:
            print(f'LLM {url} -> {e.code} {e.read().decode("utf-8")[:200]}')
        except Exception as e:
            print(f'LLM {url} -> {str(e)[:200]}')
    return ''


def parse_json(text: str):
    text = text.strip()
    if text.startswith('```'):
        text = text.split('```')[1]
        if text.startswith('json'):
            text = text[4:]
    start = min([i for i in (text.find('{'), text.find('[')) if i >= 0] or [0])
    end = max(text.rfind('}'), text.rfind(']'))
    if end > start:
        text = text[start:end + 1]
    try:
        return json.loads(text)
    except json.JSONDecodeError:
        return None



def run(role: str, prompt: str, context_data: dict):
    """Запускает ассистента и возвращает разобранный JSON-ответ."""
    if role not in ROLES:
        return {'configured': True, 'error': 'role'}
    if not PROVIDERS:
        return {'configured': False, 'message': 'Ключ языковой модели не добавлен'}

    user_msg = prompt
    if context_data:
        user_msg += '\n\nИсходные данные проекта:\n' + json.dumps(context_data, ensure_ascii=False)[:3000]

    reply = ask({
        'messages': [
            {'role': 'system', 'content': ROLES[role]},
            {'role': 'user', 'content': user_msg},
        ],
        'temperature': 0.5,
        'max_tokens': 2200,
        'response_format': {'type': 'json_object'},
    })

    if not reply:
        return {'configured': False,
                'message': 'Ассистент временно недоступен. Проверьте баланс DeepSeek или ключ GROQ_API_KEY.'}

    data = parse_json(reply)
    if data is None:
        return {'configured': True, 'raw': reply[:2000], 'data': None}
    return {'configured': True, 'role': role, 'data': data}
