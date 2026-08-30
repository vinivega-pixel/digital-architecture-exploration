import hashlib
import json
import os
import secrets
from datetime import datetime, timedelta

import psycopg2
import psycopg2.extras

CORS = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, X-Auth-Token',
    'Access-Control-Max-Age': '86400',
    'Content-Type': 'application/json',
}

PLAN_DAYS = {'day': 1, 'week': 7, 'month': 30, 'quarter': 90, 'year': 365, 'forever': 3650}


def db():
    return psycopg2.connect(os.environ['DATABASE_URL'])


def esc(value) -> str:
    return str(value).replace("'", "''")


def num(value, default=0) -> int:
    try:
        return int(value)
    except (TypeError, ValueError):
        return default


def hash_password(password: str, salt: str = '') -> str:
    salt = salt or secrets.token_hex(16)
    digest = hashlib.pbkdf2_hmac('sha256', password.encode('utf-8'), salt.encode('utf-8'), 120000)
    return f'{salt}${digest.hex()}'


def respond(code: int, payload: dict) -> dict:
    return {
        'statusCode': code,
        'headers': CORS,
        'isBase64Encoded': False,
        'body': json.dumps(payload, ensure_ascii=False, default=str),
    }


def admin_by_token(cur, token: str):
    if not token:
        return None
    cur.execute(
        "SELECT u.id, u.email, u.name, u.role FROM sessions s JOIN users u ON u.id = s.user_id "
        f"WHERE s.token = '{esc(token)}' AND s.expires_at > NOW() AND u.role = 'admin' "
        "AND u.blocked = FALSE LIMIT 1"
    )
    return cur.fetchone()


def log(cur, admin_id: int, action: str, target: int = None, details: str = ''):
    tgt = 'NULL' if target is None else str(int(target))
    cur.execute(
        "INSERT INTO admin_log (admin_id, action, target_user_id, details) VALUES "
        f"({int(admin_id)}, '{esc(action)}', {tgt}, '{esc(details)[:500]}')"
    )


def handler(event: dict, context) -> dict:
    """Административный кабинет: статистика, пользователи, подписки, платежи и журнал действий."""
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
        admin = admin_by_token(cur, token)
        if not admin:
            return respond(403, {'error': 'forbidden', 'message': 'Доступ только для администратора'})

        if action in ('', 'overview'):
            cur.execute("SELECT COUNT(*) AS c FROM users")
            users_total = cur.fetchone()['c']
            cur.execute("SELECT COUNT(*) AS c FROM users WHERE created_at > NOW() - INTERVAL '7 days'")
            users_week = cur.fetchone()['c']
            cur.execute(
                "SELECT COUNT(DISTINCT user_id) AS c FROM subscriptions "
                "WHERE status = 'active' AND expires_at > NOW()"
            )
            premium_now = cur.fetchone()['c']
            cur.execute("SELECT COALESCE(SUM(amount), 0) AS s FROM payments WHERE status = 'paid'")
            revenue = cur.fetchone()['s']
            cur.execute(
                "SELECT COALESCE(SUM(amount), 0) AS s FROM payments "
                "WHERE status = 'paid' AND paid_at > NOW() - INTERVAL '30 days'"
            )
            revenue_month = cur.fetchone()['s']
            cur.execute("SELECT COUNT(*) AS c FROM downloads")
            downloads_total = cur.fetchone()['c']
            cur.execute("SELECT COUNT(*) AS c FROM downloads WHERE created_at > NOW() - INTERVAL '7 days'")
            downloads_week = cur.fetchone()['c']
            cur.execute("SELECT COUNT(*) AS c FROM users WHERE blocked = TRUE")
            blocked = cur.fetchone()['c']
            cur.execute(
                "SELECT title, kind, COUNT(*) AS c FROM downloads "
                "GROUP BY title, kind ORDER BY c DESC LIMIT 10"
            )
            top = [dict(r) for r in cur.fetchall()]

            return respond(200, {
                'admin': dict(admin),
                'stats': {
                    'usersTotal': users_total,
                    'usersWeek': users_week,
                    'premiumNow': premium_now,
                    'blocked': blocked,
                    'revenue': float(revenue or 0),
                    'revenueMonth': float(revenue_month or 0),
                    'downloadsTotal': downloads_total,
                    'downloadsWeek': downloads_week,
                },
                'top': top,
            })

        if action == 'users':
            q = esc(str(params.get('q') or body.get('q') or '').strip().lower())
            where = ''
            if q:
                where = (
                    f"WHERE LOWER(u.email) LIKE '%{q}%' OR LOWER(COALESCE(u.name, '')) LIKE '%{q}%' "
                    f"OR LOWER(COALESCE(u.company, '')) LIKE '%{q}%'"
                )
            cur.execute(
                "SELECT u.id, u.email, u.name, u.company, u.role, u.blocked, u.note, u.created_at, "
                "  s.plan, s.expires_at, "
                "  (SELECT COUNT(*) FROM downloads d WHERE d.user_id = u.id) AS downloads, "
                "  (SELECT COALESCE(SUM(p.amount), 0) FROM payments p WHERE p.user_id = u.id AND p.status = 'paid') AS paid "
                "FROM users u "
                "LEFT JOIN LATERAL (SELECT plan, expires_at FROM subscriptions "
                "  WHERE user_id = u.id AND status = 'active' AND expires_at > NOW() "
                "  ORDER BY expires_at DESC LIMIT 1) s ON TRUE "
                f"{where} ORDER BY u.created_at DESC LIMIT 300"
            )
            return respond(200, {'items': [dict(r) for r in cur.fetchall()]})

        if action == 'user':
            uid = num(body.get('userId') or params.get('userId'))
            cur.execute(
                "SELECT id, email, name, company, role, blocked, note, created_at FROM users "
                f"WHERE id = {uid}"
            )
            user = cur.fetchone()
            if not user:
                return respond(404, {'error': 'not_found'})
            cur.execute(
                "SELECT id, plan, status, amount, starts_at, expires_at, created_at FROM subscriptions "
                f"WHERE user_id = {uid} ORDER BY created_at DESC LIMIT 50"
            )
            subs = [dict(r) for r in cur.fetchall()]
            cur.execute(
                "SELECT id, inv_id, plan, amount, status, paid_at, created_at FROM payments "
                f"WHERE user_id = {uid} ORDER BY created_at DESC LIMIT 50"
            )
            pays = [dict(r) for r in cur.fetchall()]
            cur.execute(
                "SELECT id, kind, title, stage, created_at FROM downloads "
                f"WHERE user_id = {uid} ORDER BY created_at DESC LIMIT 100"
            )
            dls = [dict(r) for r in cur.fetchall()]
            return respond(200, {
                'user': dict(user),
                'subscriptions': subs,
                'payments': pays,
                'downloads': dls,
            })

        if action == 'grant':
            uid = num(body.get('userId'))
            plan = str(body.get('plan') or 'month')
            days = PLAN_DAYS.get(plan, 30)
            expires = (datetime.utcnow() + timedelta(days=days)).strftime('%Y-%m-%d %H:%M:%S')
            cur.execute(f"UPDATE subscriptions SET status = 'replaced' WHERE user_id = {uid} AND status = 'active'")
            cur.execute(
                "INSERT INTO subscriptions (user_id, plan, status, amount, starts_at, expires_at) VALUES "
                f"({uid}, '{esc(plan)}', 'active', 0, NOW(), '{expires}')"
            )
            log(cur, admin['id'], 'grant_premium', uid, f'plan={plan}, до {expires}')
            conn.commit()
            return respond(200, {'ok': True, 'expiresAt': expires})

        if action == 'revoke':
            uid = num(body.get('userId'))
            cur.execute(f"UPDATE subscriptions SET status = 'revoked', expires_at = NOW() WHERE user_id = {uid} AND status = 'active'")
            log(cur, admin['id'], 'revoke_premium', uid, '')
            conn.commit()
            return respond(200, {'ok': True})

        if action == 'block':
            uid = num(body.get('userId'))
            flag = 'TRUE' if body.get('blocked') else 'FALSE'
            if uid == admin['id']:
                return respond(400, {'error': 'self', 'message': 'Нельзя заблокировать самого себя'})
            cur.execute(f"UPDATE users SET blocked = {flag} WHERE id = {uid}")
            if flag == 'TRUE':
                cur.execute(f"UPDATE sessions SET expires_at = NOW() WHERE user_id = {uid}")
            log(cur, admin['id'], 'block' if flag == 'TRUE' else 'unblock', uid, '')
            conn.commit()
            return respond(200, {'ok': True})

        if action == 'set_role':
            uid = num(body.get('userId'))
            role = 'admin' if body.get('role') == 'admin' else 'user'
            if uid == admin['id'] and role != 'admin':
                return respond(400, {'error': 'self', 'message': 'Нельзя снять права с самого себя'})
            cur.execute(f"UPDATE users SET role = '{role}' WHERE id = {uid}")
            log(cur, admin['id'], 'set_role', uid, role)
            conn.commit()
            return respond(200, {'ok': True})

        if action == 'set_note':
            uid = num(body.get('userId'))
            note = str(body.get('note') or '')[:2000]
            cur.execute(f"UPDATE users SET note = '{esc(note)}' WHERE id = {uid}")
            conn.commit()
            return respond(200, {'ok': True})

        if action == 'reset_password':
            uid = num(body.get('userId'))
            password = str(body.get('password') or '')
            if len(password) < 6:
                return respond(400, {'error': 'weak', 'message': 'Пароль — не менее 6 символов'})
            cur.execute(f"UPDATE users SET password_hash = '{esc(hash_password(password))}' WHERE id = {uid}")
            cur.execute(f"UPDATE sessions SET expires_at = NOW() WHERE user_id = {uid}")
            log(cur, admin['id'], 'reset_password', uid, '')
            conn.commit()
            return respond(200, {'ok': True})

        if action == 'delete_user':
            uid = num(body.get('userId'))
            if uid == admin['id']:
                return respond(400, {'error': 'self', 'message': 'Нельзя удалить самого себя'})
            cur.execute(f"DELETE FROM downloads WHERE user_id = {uid}")
            cur.execute(f"DELETE FROM sessions WHERE user_id = {uid}")
            cur.execute(f"UPDATE payments SET user_id = NULL, subscription_id = NULL WHERE user_id = {uid}")
            cur.execute(f"DELETE FROM subscriptions WHERE user_id = {uid}")
            cur.execute(f"DELETE FROM users WHERE id = {uid}")
            log(cur, admin['id'], 'delete_user', uid, '')
            conn.commit()
            return respond(200, {'ok': True})

        if action == 'payments':
            cur.execute(
                "SELECT p.id, p.inv_id, p.plan, p.amount, p.status, p.paid_at, p.created_at, "
                "  u.email, u.name FROM payments p LEFT JOIN users u ON u.id = p.user_id "
                "ORDER BY p.created_at DESC LIMIT 200"
            )
            return respond(200, {'items': [dict(r) for r in cur.fetchall()]})

        if action == 'downloads':
            cur.execute(
                "SELECT d.id, d.kind, d.title, d.stage, d.created_at, u.email FROM downloads d "
                "LEFT JOIN users u ON u.id = d.user_id ORDER BY d.created_at DESC LIMIT 200"
            )
            return respond(200, {'items': [dict(r) for r in cur.fetchall()]})

        if action == 'log':
            cur.execute(
                "SELECT l.id, l.action, l.details, l.created_at, l.target_user_id, a.email AS admin_email "
                "FROM admin_log l LEFT JOIN users a ON a.id = l.admin_id "
                "ORDER BY l.created_at DESC LIMIT 200"
            )
            return respond(200, {'items': [dict(r) for r in cur.fetchall()]})

        return respond(400, {'error': 'unknown_action'})
    finally:
        cur.close()
        conn.close()
