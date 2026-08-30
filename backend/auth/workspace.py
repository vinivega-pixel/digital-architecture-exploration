import base64
import json
import os
import uuid

FOLDERS = ['tz', 'drawings', 'estimates', 'norms', 'letters', 'refs']


def esc(value) -> str:
    return str(value).replace("'", "''")


def num(value, default=0) -> int:
    try:
        return int(value)
    except (TypeError, ValueError):
        return default


def s3_client():
    import boto3

    return boto3.client(
        's3',
        endpoint_url='https://bucket.poehali.dev',
        aws_access_key_id=os.environ['AWS_ACCESS_KEY_ID'],
        aws_secret_access_key=os.environ['AWS_SECRET_ACCESS_KEY'],
    )


def my_workspace(cur, user_id: int):
    cur.execute(
        "SELECT id, code, title, status, theme, note FROM workspaces "
        f"WHERE owner_id = {user_id} AND status = 'active' ORDER BY code LIMIT 1"
    )
    return cur.fetchone()


def handle(cur, conn, user, action: str, body: dict):
    """Действия премиум-кабинета. Возвращает (код, данные) либо None, если действие чужое."""
    if not action.startswith('ws_'):
        return None

    op = action[3:]
    ws = my_workspace(cur, user['id'])
    if not ws:
        return 403, {
            'error': 'no_workspace',
            'message': 'Премиум-кабинет пока не выделен. Оформите премиум или обратитесь в институт.',
        }

    wid = ws['id']

    if op == 'state':
        cur.execute(
            "SELECT id, name, kind, data, created_at, updated_at FROM ws_projects "
            f"WHERE workspace_id = {wid} AND archived = FALSE ORDER BY updated_at DESC LIMIT 100"
        )
        projects = [dict(r) for r in cur.fetchall()]
        cur.execute(
            "SELECT id, folder, name, url, mime, size_bytes, version, tags, author, attached_to, created_at "
            f"FROM ws_files WHERE workspace_id = {wid} AND archived = FALSE ORDER BY created_at DESC LIMIT 400"
        )
        files = [dict(r) for r in cur.fetchall()]
        cur.execute(
            "SELECT id, project_id, kind, author, body, target, resolved, created_at FROM ws_notes "
            f"WHERE workspace_id = {wid} ORDER BY created_at DESC LIMIT 200"
        )
        notes = [dict(r) for r in cur.fetchall()]
        cur.execute(
            "SELECT 1 FROM subscriptions "
            f"WHERE user_id = {user['id']} AND status = 'active' AND expires_at > NOW() LIMIT 1"
        )
        premium = bool(cur.fetchone()) or user.get('role') == 'admin'
        return 200, {
            'workspace': dict(ws),
            'premium': premium,
            'projects': projects,
            'files': files,
            'notes': notes,
        }

    if op == 'set_theme':
        theme = str(body.get('theme') or 'auto')[:8]
        cur.execute(f"UPDATE workspaces SET theme = '{esc(theme)}' WHERE id = {wid}")
        conn.commit()
        return 200, {'ok': True}

    if op == 'create_project':
        name = str(body.get('name') or 'Новый проект')[:255]
        kind = str(body.get('kind') or 'building')[:32]
        data = json.dumps(body.get('data') or {}, ensure_ascii=False)
        cur.execute(
            "INSERT INTO ws_projects (workspace_id, name, kind, data) VALUES "
            f"({wid}, '{esc(name)}', '{esc(kind)}', '{esc(data)}') RETURNING id"
        )
        pid = cur.fetchone()['id']
        conn.commit()
        return 200, {'ok': True, 'id': pid}

    if op == 'save_project':
        pid = num(body.get('projectId'))
        name = str(body.get('name') or '')[:255]
        data = json.dumps(body.get('data') or {}, ensure_ascii=False)
        sets = [f"data = '{esc(data)}'", 'updated_at = NOW()']
        if name:
            sets.append(f"name = '{esc(name)}'")
        cur.execute(f"UPDATE ws_projects SET {', '.join(sets)} WHERE id = {pid} AND workspace_id = {wid}")
        conn.commit()
        return 200, {'ok': True}

    if op == 'archive_project':
        pid = num(body.get('projectId'))
        cur.execute(f"UPDATE ws_projects SET archived = TRUE WHERE id = {pid} AND workspace_id = {wid}")
        conn.commit()
        return 200, {'ok': True}

    if op == 'upload':
        folder = str(body.get('folder') or 'tz')
        if folder not in FOLDERS:
            folder = 'tz'
        name = str(body.get('name') or 'файл')[:255]
        mime = str(body.get('mime') or 'application/octet-stream')[:120]
        tags = str(body.get('tags') or '')[:500]
        attached = str(body.get('attachedTo') or '')[:120]
        pid = num(body.get('projectId')) or None
        raw = base64.b64decode(body.get('data') or '')
        if not raw:
            return 400, {'error': 'empty', 'message': 'Файл пустой'}
        if len(raw) > 20 * 1024 * 1024:
            return 400, {'error': 'too_big', 'message': 'Файл больше 20 МБ'}

        key = f"workspaces/{ws['code']}/{folder}/{uuid.uuid4().hex}-{name}"
        s3_client().put_object(Bucket='files', Key=key, Body=raw, ContentType=mime)
        url = f"https://cdn.poehali.dev/projects/{os.environ['AWS_ACCESS_KEY_ID']}/bucket/{key}"

        cur.execute(
            f"SELECT id, version FROM ws_files WHERE workspace_id = {wid} AND folder = '{esc(folder)}' "
            f"AND name = '{esc(name)}' AND archived = FALSE ORDER BY version DESC LIMIT 1"
        )
        prev = cur.fetchone()
        version = (prev['version'] + 1) if prev else 1
        parent = prev['id'] if prev else None
        if prev:
            cur.execute(f"UPDATE ws_files SET archived = TRUE WHERE id = {prev['id']}")

        cur.execute(
            "INSERT INTO ws_files (workspace_id, project_id, folder, name, url, mime, size_bytes, version, "
            "parent_id, tags, author, attached_to) VALUES ("
            f"{wid}, {pid if pid else 'NULL'}, '{esc(folder)}', '{esc(name)}', '{esc(url)}', '{esc(mime)}', "
            f"{len(raw)}, {version}, {parent if parent else 'NULL'}, '{esc(tags)}', 'user', '{esc(attached)}') "
            "RETURNING id"
        )
        fid = cur.fetchone()['id']
        conn.commit()
        return 200, {'ok': True, 'id': fid, 'url': url, 'version': version}

    if op == 'file_versions':
        name = str(body.get('name') or '')[:255]
        folder = str(body.get('folder') or 'tz')
        cur.execute(
            "SELECT id, version, url, size_bytes, created_at, archived FROM ws_files "
            f"WHERE workspace_id = {wid} AND folder = '{esc(folder)}' AND name = '{esc(name)}' "
            "ORDER BY version DESC LIMIT 50"
        )
        return 200, {'items': [dict(r) for r in cur.fetchall()]}

    if op == 'restore_version':
        fid = num(body.get('fileId'))
        cur.execute(f"SELECT folder, name FROM ws_files WHERE id = {fid} AND workspace_id = {wid}")
        row = cur.fetchone()
        if not row:
            return 404, {'error': 'not_found'}
        cur.execute(
            f"UPDATE ws_files SET archived = TRUE WHERE workspace_id = {wid} "
            f"AND folder = '{esc(row['folder'])}' AND name = '{esc(row['name'])}'"
        )
        cur.execute(f"UPDATE ws_files SET archived = FALSE WHERE id = {fid}")
        conn.commit()
        return 200, {'ok': True}

    if op == 'delete_file':
        fid = num(body.get('fileId'))
        cur.execute(f"UPDATE ws_files SET archived = TRUE WHERE id = {fid} AND workspace_id = {wid}")
        conn.commit()
        return 200, {'ok': True}

    if op == 'add_note':
        pid = num(body.get('projectId')) or None
        kind = str(body.get('kind') or 'question')[:16]
        author = str(body.get('author') or 'user')[:64]
        text = str(body.get('body') or '')[:4000]
        target = str(body.get('target') or '')[:120]
        if not text:
            return 400, {'error': 'empty'}
        cur.execute(
            "INSERT INTO ws_notes (workspace_id, project_id, kind, author, body, target) VALUES ("
            f"{wid}, {pid if pid else 'NULL'}, '{esc(kind)}', '{esc(author)}', '{esc(text)}', '{esc(target)}') "
            "RETURNING id"
        )
        nid = cur.fetchone()['id']
        conn.commit()
        return 200, {'ok': True, 'id': nid}

    if op == 'resolve_note':
        nid = num(body.get('noteId'))
        flag = 'TRUE' if body.get('resolved', True) else 'FALSE'
        cur.execute(f"UPDATE ws_notes SET resolved = {flag} WHERE id = {nid} AND workspace_id = {wid}")
        conn.commit()
        return 200, {'ok': True}

    return 400, {'error': 'unknown_ws_action'}
