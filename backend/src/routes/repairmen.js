const express = require("express");
const router = express.Router();
const db = require("../config/db");
const bcrypt = require("bcrypt"); //для хеширования паролей

//получения списска всех ремонтников
// router.get("/", async (req, res) => {
//   try {
//     const [repairmen] = await db.query("SELECT * FROM users WHERE role = 'repairman'");
//     res.json(repairmen);
//   } catch (error) {
//     console.error("Ошибка при получении списка ремонтников:", error);
//     res.status(500).json({ message: "Ошибка сервера" });
//   }
// });
router.get("/", async (req, res) => {
    try {
      const query = `
        SELECT users.id, users.username, users.photo, users.specialization, users.service_center_id,
               service_centers.name AS service_center_name
        FROM users
        LEFT JOIN service_centers ON users.service_center_id = service_centers.id
        WHERE users.role = 'repairman'
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

    const query = `
      UPDATE users 
      SET username = ?, photo = ?, specialization = ?, service_center_id = ?
      WHERE id = ? AND role = 'repairman'`;
    const [result] = await db.query(query, [username, photo, specialization, service_center_id, repairmanId]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Ремонтник не найден" });
    }

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
  

module.exports = router;
