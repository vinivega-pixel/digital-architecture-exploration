-- Премиум-кабинеты ID0001..ID0033
CREATE TABLE IF NOT EXISTS workspaces (
    id SERIAL PRIMARY KEY,
    code VARCHAR(8) NOT NULL UNIQUE,
    owner_id INTEGER REFERENCES users(id),
    title VARCHAR(255),
    status VARCHAR(16) NOT NULL DEFAULT 'reserved',
    theme VARCHAR(8) NOT NULL DEFAULT 'auto',
    note TEXT,
    assigned_at TIMESTAMP,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_workspaces_owner ON workspaces(owner_id);

CREATE TABLE IF NOT EXISTS ws_projects (
    id SERIAL PRIMARY KEY,
    workspace_id INTEGER NOT NULL REFERENCES workspaces(id),
    name VARCHAR(255) NOT NULL,
    kind VARCHAR(32) NOT NULL DEFAULT 'building',
    data TEXT,
    archived BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_ws_projects_ws ON ws_projects(workspace_id);

CREATE TABLE IF NOT EXISTS ws_files (
    id SERIAL PRIMARY KEY,
    workspace_id INTEGER NOT NULL REFERENCES workspaces(id),
    project_id INTEGER REFERENCES ws_projects(id),
    folder VARCHAR(32) NOT NULL DEFAULT 'tz',
    name VARCHAR(255) NOT NULL,
    url TEXT NOT NULL,
    mime VARCHAR(120),
    size_bytes BIGINT NOT NULL DEFAULT 0,
    version INTEGER NOT NULL DEFAULT 1,
    parent_id INTEGER,
    tags TEXT,
    author VARCHAR(64) NOT NULL DEFAULT 'user',
    attached_to VARCHAR(120),
    archived BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_ws_files_ws ON ws_files(workspace_id, folder);

CREATE TABLE IF NOT EXISTS ws_notes (
    id SERIAL PRIMARY KEY,
    workspace_id INTEGER NOT NULL REFERENCES workspaces(id),
    project_id INTEGER REFERENCES ws_projects(id),
    kind VARCHAR(16) NOT NULL DEFAULT 'question',
    author VARCHAR(64) NOT NULL DEFAULT 'engineer',
    body TEXT NOT NULL,
    target VARCHAR(120),
    resolved BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_ws_notes_ws ON ws_notes(workspace_id);

INSERT INTO workspaces (code, status, title)
SELECT 'ID' || LPAD(g::text, 4, '0'), 'reserved', 'Кабинет ID' || LPAD(g::text, 4, '0')
FROM generate_series(1, 33) AS g
ON CONFLICT (code) DO NOTHING;

UPDATE workspaces w SET owner_id = u.id, status = 'active', assigned_at = NOW(),
       title = 'Кабинет главного администратора'
FROM users u WHERE u.email = 'admin@cifra.institute' AND w.code = 'ID0001';

UPDATE workspaces w SET owner_id = u.id, status = 'active', assigned_at = NOW(),
       title = 'Кабинет владельца'
FROM users u WHERE u.email = 'elco72@mail.ru' AND w.code = 'ID0002';

UPDATE workspaces w SET owner_id = u.id, status = 'reserved', note = 'Резерв главного администратора'
FROM users u WHERE u.email = 'admin@cifra.institute' AND w.code BETWEEN 'ID0003' AND 'ID0033';
