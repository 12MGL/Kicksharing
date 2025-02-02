const express = require("express");
const router = express.Router();
const db = require("../config/db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const SECRET_KEY = "Operation_bI"; //чтобы никто не догадался

router.post("/login", async (req, res) => {
    const { username, password } = req.body;
    
    //логируем полученные данные
    console.log("Полученные данные:", { username, password });

    try {
        const [users] = await db.query(
            `SELECT users.id, users.username, users.specialization, 
                    users.service_center_id, users.password, service_centers.name AS service_center_name
             FROM users
             LEFT JOIN service_centers ON users.service_center_id = service_centers.id
             WHERE users.username = ? AND users.role = "repairman"`, 
            [username]
        );

        console.log("Данные пользователя из БД:", users);

        if (users.length === 0) {
            return res.status(401).json({ message: "Неверное имя пользователя или пароль" });
        }

        const user = users[0];

        // Проверяем, переданы ли корректные данные
        if (!password || !user.password) {
            console.error("Ошибка: переданы некорректные данные для bcrypt.compare()");
            return res.status(400).json({ error: "Некорректные учетные данные" });
        }

        // Проверяем пароль
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: "Неверное имя пользователя или пароль" });
        }

        // Создаём токен
        const token = jwt.sign({ id: user.id, service_center_id: user.service_center_id }, SECRET_KEY, { expiresIn: "12h" });

        res.json({ 
            token, 
            repairman: { 
                id: user.id, 
                username: user.username, 
                specialization: user.specialization, 
                service_center_id: user.service_center_id, 
                service_center_name: user.service_center_name 
            } 
        });

    } catch (error) {
        console.error("Ошибка при авторизации:", error);
        res.status(500).json({ message: "Ошибка сервера" });
    }
});

router.post("/change-password", async (req, res) => {
    const { repairman_id, oldPassword, newPassword } = req.body;

    if (!repairman_id || !oldPassword || !newPassword) {
        return res.status(400).json({ message: "Заполните все поля" });
    }

    try {
        const [users] = await db.query("SELECT password FROM users WHERE id = ?", [repairman_id]);

        if (users.length === 0) {
            return res.status(404).json({ message: "Пользователь не найден" });
        }

        const user = users[0];

        const isMatch = await bcrypt.compare(oldPassword, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Старый пароль неверный" });
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);
        await db.query("UPDATE users SET password = ? WHERE id = ?", [hashedPassword, repairman_id]);

        res.json({ success: true, message: "Пароль успешно изменён" });

    } catch (error) {
        console.error("Ошибка при смене пароля:", error);
        res.status(500).json({ message: "Ошибка сервера" });
    }
});


module.exports = router;
