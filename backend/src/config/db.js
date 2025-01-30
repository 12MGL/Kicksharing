const mysql = require('mysql2');
require('dotenv').config(); // загрузка переменных окружения для подключеня к БД

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME
});

// дебажноэ
// pool.getConnection()
//   .then(() => console.log("✅ База данных подключена!"))
//   .catch((err) => console.error("❌ Ошибка подключения к базе данных:", err));

// promise-обёртка для асинхронных запросов
const promisePool = pool.promise();

module.exports = promisePool;
