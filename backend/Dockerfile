#образ alpine сократит размер контейнера
FROM node:22-alpine

#создание директории, копирование файлов, установка зависимостей
WORKDIR /app
COPY ./backend/package*.json ./
RUN npm install --only=production
RUN npm install cors --save

#копирование всего приложения
COPY ./backend .

#используем порт 3000, запускаем app.js
EXPOSE 3000
CMD ["node", "src/app.js"]
