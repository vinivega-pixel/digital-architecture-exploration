import hashlib
import json
import os
import random
from datetime import datetime, timedelta
from urllib.parse import urlencode

import psycopg2
import psycopg2.extras

CORS = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, X-Auth-Token',
    'Access-Control-Max-Age': '86400',
    'Content-Type': 'application/json',
}

PLANS = {
    'day': {'title': 'Премиум-доступ на сутки', 'amount': 999, 'days': 1},
    'week': {'title': 'Премиум-доступ на неделю', 'amount': 4990, 'days': 7},
    'month': {'title': 'Премиум-доступ на месяц, всё включено', 'amount': 99999, 'days': 30},
}

ROBOKASSA_URL = 'https://auth.robokassa.ru/Merchant/Index.aspx'


def db():
    return psycopg2.connect(os.environ['DATABASE_URL'])


def esc(value) -> str:
    return str(value).replace("'", "''")


def respond(code: int, payload: dict) -> dict:
    return {'statusCode': code, 'headers': CORS, 'body': json.dumps(payload, ensure_ascii=False, default=str)}


def md5(value: str) -> str:
    return hashlib.md5(value.encode('utf-8')).hexdigest()


def user_by_token(cur, token: str):
    if not token:
        return None
    cur.execute(f"SELECT user_id FROM sessions WHERE token = '{esc(token)}' AND expires_at > NOW() LIMIT 1")
    row = cur.fetchone()
    return row['user_id'] if row else None


def activate(cur, payment):
    """Открывает премиум-доступ после подтверждённой оплаты."""
    plan = PLANS.get(payment['plan'])
    if not plan or not payment['user_id']:
        return

    cur.execute(
        "SELECT expires_at FROM subscriptions "
        f"WHERE user_id = {payment['user_id']} AND status = 'active' AND expires_at > NOW() "
        "ORDER BY expires_at DESC LIMIT 1"
    )
    current = cur.fetchone()
    base = current['expires_at'] if current else datetime.utcnow()
    expires = (base + timedelta(days=plan['days'])).strftime('%Y-%m-%d %H:%M:%S')
    starts = datetime.utcnow().strftime('%Y-%m-%d %H:%M:%S')

    cur.execute(
        "INSERT INTO subscriptions (user_id, plan, status, amount, starts_at, expires_at) VALUES "
        f"({payment['user_id']}, '{esc(payment['plan'])}', 'active', {payment['amount']}, "
        f"'{starts}', '{expires}') RETURNING id"
    )
    sub_id = cur.fetchone()['id']
    cur.execute(
        f"UPDATE payments SET status = 'paid', paid_at = NOW(), subscription_id = {sub_id} "
        f"WHERE id = {payment['id']}"
    )


def handler(event: dict, context) -> dict:
    """Оплата премиум-подписки через Робокассу: создание счёта и приём уведомления о платеже."""
    method = event.get('httpMethod', 'GET')

    if method == 'OPTIONS':
        return {'statusCode': 200, 'headers': CORS, 'body': ''}

    params = event.get('queryStringParameters') or {}
    headers = event.get('headers') or {}
    token = headers.get('X-Auth-Token') or headers.get('x-auth-token') or ''

    body = {}
    if event.get('body'):
        try:
            body = json.loads(event['body'])
        except Exception:
            body = {}

    action = body.get('action') or params.get('action') or ''
    login = os.environ.get('ROBOKASSA_LOGIN', '')
    pass1 = os.environ.get('ROBOKASSA_PASSWORD1', '')
    pass2 = os.environ.get('ROBOKASSA_PASSWORD2', '')
    is_test = os.environ.get('ROBOKASSA_IS_TEST', '1') == '1'

    conn = db()
    cur = conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor)

    try:
        if action == 'plans':
            return respond(200, {'plans': [{'id': k, **v} for k, v in PLANS.items()]})

        if action == 'create':
            plan_id = str(body.get('plan') or 'year')
            plan = PLANS.get(plan_id)
            if not plan:
                return respond(400, {'error': 'unknown_plan'})

            user_id = user_by_token(cur, token)
            if not user_id:
                return respond(401, {'error': 'unauthorized', 'message': 'Войдите, чтобы оформить подписку'})

            if not login or not pass1:
                return respond(200, {
                    'configured': False,
                    'message': 'Приём оплаты не настроен: не заданы реквизиты Робокассы.',
                })

            inv_id = random.randint(1000000, 2000000000)
            amount = plan['amount']
            cur.execute(
                "INSERT INTO payments (user_id, inv_id, plan, amount, status) VALUES "
                f"({user_id}, {inv_id}, '{esc(plan_id)}', {amount}, 'pending')"
            )
            conn.commit()

            out_sum = f'{amount:.2f}'
            signature = md5(f'{login}:{out_sum}:{inv_id}:{pass1}')
            query = {
                'MerchantLogin': login,
                'OutSum': out_sum,
                'InvId': inv_id,
                'Description': plan['title'],
                'SignatureValue': signature,
                'Culture': 'ru',
                'Encoding': 'utf-8',
            }
            if is_test:
                query['IsTest'] = 1

            return respond(200, {
                'configured': True,
                'paymentUrl': f'{ROBOKASSA_URL}?{urlencode(query)}',
                'invId': inv_id,
                'amount': amount,
                'plan': plan_id,
            })

        if action == 'result' or params.get('OutSum'):
            out_sum = params.get('OutSum') or ''
            inv_id = params.get('InvId') or ''
            signature = (params.get('SignatureValue') or '').lower()

            expected = md5(f'{out_sum}:{inv_id}:{pass2}')
            if not signature or signature != expected:
                return {'statusCode': 400, 'headers': {'Content-Type': 'text/plain', 'Access-Control-Allow-Origin': '*'}, 'body': 'bad sign'}

            cur.execute(f"SELECT * FROM payments WHERE inv_id = {int(inv_id)} LIMIT 1")
            payment = cur.fetchone()
            if not payment:
                return {'statusCode': 404, 'headers': {'Content-Type': 'text/plain', 'Access-Control-Allow-Origin': '*'}, 'body': 'not found'}

            if payment['status'] != 'paid':
                activate(cur, payment)
                conn.commit()

            return {'statusCode': 200, 'headers': {'Content-Type': 'text/plain', 'Access-Control-Allow-Origin': '*'}, 'body': f'OK{inv_id}'}

        if action == 'status':
            user_id = user_by_token(cur, token)
            if not user_id:
                return respond(401, {'error': 'unauthorized'})
            cur.execute(
                "SELECT plan, status, amount, starts_at, expires_at FROM subscriptions "
                f"WHERE user_id = {user_id} ORDER BY created_at DESC LIMIT 20"
            )
            subs = [dict(r) for r in cur.fetchall()]
            cur.execute(
                "SELECT inv_id, plan, amount, status, paid_at, created_at FROM payments "
                f"WHERE user_id = {user_id} ORDER BY created_at DESC LIMIT 20"
            )
            pays = [dict(r) for r in cur.fetchall()]
            active = next((s for s in subs if s['status'] == 'active' and s['expires_at'] and s['expires_at'] > datetime.utcnow()), None)
            return respond(200, {
                'premium': bool(active),
                'active': active,
                'subscriptions': subs,
                'payments': pays,
            })

        return respond(400, {'error': 'unknown_action'})
    finally:
        cur.close()
        conn.close()