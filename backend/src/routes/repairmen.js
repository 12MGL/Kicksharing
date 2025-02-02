const express = require("express");
const router = express.Router();
const db = require("../config/db");
const bcrypt = require("bcrypt"); //для хеширования паролей
const { logAdminAction } = require("../utils/logger");

router.get("/", async (req, res) => {
    try {

      const query = `
        SELECT users.id, users.username, users.photo, users.specialization, users.service_center_id,
              service_centers.name AS service_center_name,
              COUNT(repairs.id) AS total_repairs,
              SUM(CASE WHEN repairs.success = 1 THEN 1 ELSE 0 END) AS successful_repairs
        FROM users
        LEFT JOIN service_centers ON users.service_center_id = service_centers.id
        LEFT JOIN repairs ON users.id = repairs.repairman_id
        WHERE users.role = 'repairman'
        GROUP BY users.id
        `;

      const [rows] = await db.query(query);
      res.json(rows);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Ошибка сервера" });
    }
  });

//добавление нового ремонтника
router.post("/", async (req, res) => {
  try {
    const { username, photo, specialization, service_center_id } = req.body;
    const adminId = req.headers["admin-id"] || 1; //полуачем id админа для логов, либо "1", если невозможно получить

    if (!username || !specialization) {
      return res.status(400).json({ message: "Имя и специальность обязательны" });
    }
    //для всех ремонтников при добавлении через админку устанавливается стандартный пароль 1234, потом его можно будет сменить в интерфейсе ремонтника
    const defaultPassword = "1234";
    const hashedPassword = await bcrypt.hash(defaultPassword, 10);

    const query = `
      INSERT INTO users (username, password, role, photo, service_center_id, specialization) 
      VALUES (?, ?, 'repairman', ?, ?, ?)`;
    const [result] = await db.query(query, [username, hashedPassword, photo || null, service_center_id || null, specialization]);
 
    //логируем действия админа
    await logAdminAction(adminId, "добавил ремонтника: ", `ID: ${result.insertId}, имя: ${username}`);

    res.json({ message: "Ремонтник добавлен!", id: result.insertId });
  } catch (error) {
    console.error("Ошибка при добавлении ремонтника:", error);
    res.status(500).json({ message: "Ошибка сервера" });
  }
});

//редактирование ремонтника
router.put("/:id", async (req, res) => {
  try {
    const repairmanId = req.params.id;
    const { username, photo, specialization, service_center_id } = req.body;
    const adminId = req.headers["admin-id"] || 1; //полуачем id админа для логов, либо "1", если невозможно получить

    const query = `
      UPDATE users 
      SET username = ?, photo = ?, specialization = ?, service_center_id = ?
      WHERE id = ? AND role = 'repairman'`;
    const [result] = await db.query(query, [username, photo, specialization, service_center_id, repairmanId]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Ремонтник не найден" });
    }
    
    //логируем действия админа
    await logAdminAction(adminId, "Редактировал ремонтника", `ID: ${repairmanId}, Имя: ${username}`);

    res.json({ message: "Данные обновлены!" });
  } catch (error) {
    console.error("Ошибка при редактировании ремонтника:", error);
    res.status(500).json({ message: "Ошибка сервера" });
  }
});

//получение списка всех складов
router.get("/service-centers", async (req, res) => {
    try {
      const [rows] = await db.query("SELECT id, name FROM service_centers");
      res.json(rows);
    } catch (error) {
      console.error("Ошибка при получении складов:", error);
      res.status(500).json({ message: "Ошибка сервера" });
    }
  });

//получение списка всех ремонтов ремонтника
router.get("/:id/repairs", async (req, res) => {
  try {
      const repairmanId = req.params.id;
      const query = `
          SELECT r.id, r.repair_timestamp, r.node, r.repair_type, r.success,
                 s.serial_number AS scooter_serial_number, 
                 s.registration_number AS scooter_registration_number,
                 u.username AS repairman_name
          FROM repairs r
          JOIN scooters s ON r.scooter_id = s.id
          JOIN users u ON r.repairman_id = u.id
          WHERE r.repairman_id = ?
          ORDER BY r.repair_timestamp DESC
      `;
      const [repairs] = await db.query(query, [repairmanId]);

      res.json(repairs);
  } catch (error) {
      console.error("Ошибка при получении истории ремонтов ремонтника:", error);
      res.status(500).json({ message: "Ошибка сервера" });
  }
});

  

module.exports = router;
