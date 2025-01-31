const express = require("express");
const router = express.Router();
const db = require("../config/db");

//получение логов
router.get("/", async (req, res) => {
    try {
        const [logs] = await db.query(`
            SELECT admin_logs.id, users.username AS admin_name, admin_logs.action, admin_logs.details, admin_logs.timestamp
            FROM admin_logs
            JOIN users ON admin_logs.admin_id = users.id
            ORDER BY admin_logs.timestamp DESC
        `);
        res.json(logs);
    } catch (error) {
        console.error("Ошибка при получении логов:", error);
        res.status(500).json({ message: "Ошибка сервера" });
    }
});

module.exports = router;
