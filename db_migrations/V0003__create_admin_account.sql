-- Аккаунт главного администратора сайта
INSERT INTO users (email, password_hash, name, company, role)
VALUES (
    'admin@cifra.institute',
    '565fcf9d017ae36451f1ca31d631ef2f$2b304a78b85cfe3fb40ab01b3b5071b9700a02e065bfe7b9a41b576abf4f7ec6',
    'Главный администратор',
    'ООО «Цифра»',
    'admin'
)
ON CONFLICT (email) DO UPDATE SET role = 'admin', blocked = FALSE;

-- Владелец проекта получает права администратора
UPDATE users SET role = 'admin' WHERE email = 'elco72@mail.ru';
