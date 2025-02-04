Добрый день! 

Данный контейнер содержит проект **Kicksharing**.

Полноценная система управления ремонтом самокатов с админ-панелью и интерфейсом ремонтников.  
Запуск выполняется через Docker, разворачивая базу данных, бэкенд и оба фронтенда.

## Как запустить проект?

### Запустите Docker
### Клонируйте проект
git clone https://github.com/12MGL/Kicksharing
cd kicksharing
### Соберите и запустите контейнер
docker-compose build --no-cache
docker-compose up -d
### Подождите пару минут, пока контейнеры соберутся

## Доступ к системе
После запуска, откройте в браузере:
Админ-панель: http://localhost:8080
Интерфейс ремонтников: http://localhost:8081
Порт бэкенда: 3000. Освободите порт от других программ для избежания конфликтов.
### Остановка проекта
docker-compose down
### Обновление проекта до последней версии
docker-compose down
docker system prune -a --volumes
git pull origin main
docker-compose build --no-cache
docker-compose up -d

## Запуск вручную:
### установка IP для подключения с внешних устройств:

### backend: 
cd backend
npm run dev
### admin-panel:
cd admin-panel
npx webpack serve
http://localhost:8080/
### repairmen-interface
cd repairmen-interface
npx webpack serve
http://localhost:8081/

### Для обновления внутреннего ip вручную, используйте скрипт в корне проекта 
set-ip-env.sh
ip отобразится при перезапуске на главных страницах фронтенда.

# Структура проекта
kicksharing/
│── backend/              # Бэкенд (Node.js + Express + MySQL)
│── admin-panel/          # Админ-панель (React)
│── repairmen-interface/  # Интерфейс ремонтников (React)
│── database/             # Бэкап базы данных
│── docker-compose.yml    # Файл конфигурации Docker
│── README.md             # Данное руководство

# База Данных
По умолчанию используется MySQL 8.0.
## Доступ:
Хост: localhost
Порт: 3307
Пользователь: root
Пароль: qweasd
Название БД: scooter_service

# Автор проекта
Разработка: Арсентий Соин
GitHub: https://github.com/12MGL