import hashlib
import json
import os
import re
import secrets
from datetime import datetime, timedelta

import psycopg2
import psycopg2.extras

CORS = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, X-Auth-Token, X-Authorization',
    'Access-Control-Max-Age': '86400',
    'Content-Type': 'application/json',
}

EMAIL_RE = re.compile(r'^[^@\s]+@[^@\s]+\.[a-zA-Z]{2,}$')
SESSION_DAYS = 30


def db():
    return psycopg2.connect(os.environ['DATABASE_URL'])


def esc(value: str) -> str:
    return str(value).replace("'", "''")


def hash_password(password: str, salt: str = '') -> str:
    salt = salt or secrets.token_hex(16)
    digest = hashlib.pbkdf2_hmac('sha256', password.encode('utf-8'), salt.encode('utf-8'), 120000)
    return f'{salt}${digest.hex()}'


def verify_password(password: str, stored: str) -> bool:
    if '$' not in stored:
        return False
    salt = stored.split('$', 1)[0]
    return secrets.compare_digest(hash_password(password, salt), stored)


def respond(code: int, payload: dict) -> dict:
    return {'statusCode': code, 'headers': CORS, 'body': json.dumps(payload, ensure_ascii=False, default=str)}


def access_state(cur, user_id: int) -> dict:
    cur.execute(
        "SELECT plan, expires_at FROM subscriptions "
        f"WHERE user_id = {user_id} AND status = 'active' AND expires_at > NOW() "
        "ORDER BY expires_at DESC LIMIT 1"
    )
    row = cur.fetchone()
    if not row:
        return {'premium': False, 'plan': None, 'expiresAt': None}
    return {'premium': True, 'plan': row['plan'], 'expiresAt': row['expires_at']}


def user_payload(cur, user_id: int) -> dict:
    cur.execute(
        "SELECT id, email, name, company, role, blocked, created_at FROM users "
        f"WHERE id = {user_id}"
    )
    user = cur.fetchone()
    if not user:
        return {}
    result = dict(user)
    result['access'] = access_state(cur, user_id)
    return result


def create_session(cur, user_id: int) -> str:
    token = secrets.token_urlsafe(48)
    expires = (datetime.utcnow() + timedelta(days=SESSION_DAYS)).strftime('%Y-%m-%d %H:%M:%S')
    cur.execute(
        f"INSERT INTO sessions (user_id, token, expires_at) VALUES ({user_id}, '{esc(token)}', '{expires}')"
    )
    return token


def user_by_token(cur, token: str):
    if not token:
        return None
    cur.execute(
        "SELECT s.user_id FROM sessions s JOIN users u ON u.id = s.user_id "
        f"WHERE s.token = '{esc(token)}' AND s.expires_at > NOW() AND u.blocked = FALSE LIMIT 1"
    )
    row = cur.fetchone()
    return row['user_id'] if row else None


def handler(event: dict, context) -> dict:
    """Регистрация, вход, профиль и история скачиваний пользователя."""
    method = event.get('httpMethod', 'GET')

    if method == 'OPTIONS':
        return {'statusCode': 200, 'headers': CORS, 'body': ''}

    headers = event.get('headers') or {}
    token = headers.get('X-Auth-Token') or headers.get('x-auth-token') or ''

    params = event.get('queryStringParameters') or {}
    action = params.get('action') or ''
    body = {}
    if event.get('body'):
        body = json.loads(event['body'])
        action = body.get('action') or action

    conn = db()
    cur = conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor)

    try:
        if action.startswith('ws_'):
            user_id = user_by_token(cur, token)
            if not user_id:
                return respond(401, {
                    'error': 'unauthorized',
                    'message': 'Войдите в аккаунт, чтобы открыть премиум-кабинет',
                })
            cur.execute(f"SELECT id, email, name, role FROM users WHERE id = {user_id}")
            me = dict(cur.fetchone())
            import workspace
            result = workspace.handle(cur, conn, me, action, body)
            if result:
                return respond(result[0], result[1])

        if method == 'GET' or action == 'me':
            user_id = user_by_token(cur, token)
            if not user_id:
                return respond(401, {'error': 'unauthorized'})
            return respond(200, {'user': user_payload(cur, user_id)})

        if action == 'register':
            email = str(body.get('email') or '').strip().lower()
            password = str(body.get('password') or '')
            name = str(body.get('name') or '').strip()
            company = str(body.get('company') or '').strip()

            if not EMAIL_RE.match(email):
                return respond(400, {'error': 'bad_email', 'message': 'Проверьте адрес электронной почты'})
            if len(password) < 6:
                return respond(400, {'error': 'weak_password', 'message': 'Пароль — не менее 6 символов'})

            cur.execute(f"SELECT id FROM users WHERE email = '{esc(email)}'")
            if cur.fetchone():
                return respond(409, {'error': 'exists', 'message': 'Пользователь с такой почтой уже зарегистрирован'})

            cur.execute(
                "INSERT INTO users (email, password_hash, name, company) VALUES "
                f"('{esc(email)}', '{esc(hash_password(password))}', '{esc(name)}', '{esc(company)}') RETURNING id"
            )
            user_id = cur.fetchone()['id']
            session_token = create_session(cur, user_id)
            conn.commit()
            return respond(200, {'token': session_token, 'user': user_payload(cur, user_id)})

        if action == 'login':
            email = str(body.get('email') or '').strip().lower()
            password = str(body.get('password') or '')

            cur.execute(f"SELECT id, password_hash, blocked FROM users WHERE email = '{esc(email)}'")
            row = cur.fetchone()
            if not row or not verify_password(password, row['password_hash']):
                return respond(401, {'error': 'bad_credentials', 'message': 'Неверная почта или пароль'})
            if row['blocked']:
                return respond(403, {'error': 'blocked', 'message': 'Доступ к кабинету приостановлен'})

            session_token = create_session(cur, row['id'])
            conn.commit()
            return respond(200, {'token': session_token, 'user': user_payload(cur, row['id'])})

        if action == 'logout':
            if token:
                cur.execute(f"UPDATE sessions SET expires_at = NOW() WHERE token = '{esc(token)}'")
                conn.commit()
            return respond(200, {'ok': True})

        if action == 'history':
            user_id = user_by_token(cur, token)
            if not user_id:
                return respond(401, {'error': 'unauthorized'})
            cur.execute(
                "SELECT id, kind, title, stage, created_at FROM downloads "
                f"WHERE user_id = {user_id} ORDER BY created_at DESC LIMIT 100"
            )
            return respond(200, {'items': [dict(r) for r in cur.fetchall()]})

        if action == 'track':
            user_id = user_by_token(cur, token)
            if not user_id:
                return respond(200, {'ok': False})
            kind = str(body.get('kind') or 'calc')[:32]
            title = str(body.get('title') or '')[:500]
            stage = str(body.get('stage') or '')[:120]
            if title:
                cur.execute(
                    "INSERT INTO downloads (user_id, kind, title, stage) VALUES "
                    f"({user_id}, '{esc(kind)}', '{esc(title)}', '{esc(stage)}')"
                )
                conn.commit()
            return respond(200, {'ok': True})

        return respond(400, {'error': 'unknown_action'})
    finally:
        cur.close()
        conn.close()
