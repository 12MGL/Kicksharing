const db = require("../config/db");

const logAdminAction = async (adminId, action, details = "") => {
    try {
        const query = "INSERT INTO admin_logs (admin_id, action, details) VALUES (?, ?, ?)";
        await db.query("INSERT INTO admin_logs (admin_id, action, details) VALUES (?, ?, ?)", 
            [adminId, action, details]);
        console.log(`Лог записан: ${action}`);
    } catch (error) {
        console.error("Ошибка записи лога:", error);
    }
};

module.exports = { logAdminAction };
