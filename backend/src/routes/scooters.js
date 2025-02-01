const express = require('express');
const router = express.Router();
const db = require('../config/db');
const { logAdminAction } = require("../utils/logger");

router.get('/', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM scooters');    // получаем весь список самокатов
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database error' });
  }
});

//добавление самоката в БД
router.post('/', async (req, res) => {
    try {
      const { serial_number, registration_number, model, year, color, mileage, status } = req.body;
      const adminId = req.headers["admin-id"] || 1; //получаем ID админа для логирования, либо заглушка - 1
      const query = `
        INSERT INTO scooters (serial_number, registration_number, model, year, color, mileage, status)
        VALUES (?, ?, ?, ?, ?, ?, ?)`;
      
      const [result] = await db.query(query, [serial_number, registration_number, model, year, color, mileage, status]);
      
      //логируем действия 
      await logAdminAction(adminId, "Добавил самокат", `ID: ${result.insertId}, Рег.номер: ${registration_number}`);

      res.status(201).json({ id: result.insertId, message: 'Scooter added successfully!' });
    } catch (error) {
      console.error(error);
      res.status(500).send('Server Error');
    }
  });

//обновление данных о самокате в БД
router.put('/:id', async (req, res) => {
    try {
      const scooterId = req.params.id;
      const { serial_number, registration_number, model, year, color, mileage, status } = req.body;
      const adminId = req.headers["admin-id"]  || 1; //id админа для логирования либо "1", если невозможно получить
      
      const query = `
        UPDATE scooters
        SET serial_number = ?, registration_number = ?, model = ?, year = ?, color = ?, mileage = ?, status = ?
        WHERE id = ?`;
      
      const [result] = await db.query(query, [serial_number, registration_number, model, year, color, mileage, status, scooterId]);
      
      if (result.affectedRows === 0) {
        return res.status(404).json({ message: 'Scooter not found' });
      }
      
      //логирование действий админа
      await logAdminAction(adminId, "Редактировал самокат", `ID: ${scooterId}, Рег.номер: ${registration_number}`);

      res.json({ message: 'Scooter updated successfully!' });
    } catch (error) {
      console.error(error);
      res.status(500).send('Server Error');
    }
  });
  
  //получение всех ремонтов самоката
  router.get("/:id/repairs", async (req, res) => {
    try {
        const scooterId = req.params.id;
        const query = `
            SELECT r.id, r.repair_timestamp, r.node, r.repair_type, r.success, 
            u.username AS repairman_name, sc.name AS service_center_name, s.registration_number
            FROM repairs r
            JOIN scooters s ON r.scooter_id = s.id
            LEFT JOIN users u ON r.repairman_id = u.id
            LEFT JOIN service_centers sc ON u.service_center_id = sc.id
            WHERE r.scooter_id = ?
            ORDER BY r.repair_timestamp DESC
        `;
        const [repairs] = await db.query(query, [scooterId]);

        res.json(repairs);
    } catch (error) {
        console.error("Ошибка при получении истории ремонтов самоката:", error);
        res.status(500).json({ message: "Ошибка сервера" });
    }
  });

  //поиск конкретного самоката
  router.get("/search", async (req, res) => {
    try {
      const query = req.query.query;
      if (!query) return res.status(400).json({ message: "Введите номер самоката" });
  
      const sql = `
        SELECT * FROM scooters 
        WHERE serial_number = ? OR registration_number = ?
      `;
      const [rows] = await db.query(sql, [query, query]);
  
      if (rows.length === 0) return res.status(404).json({ message: "Самокат не найден" });
  
      res.json(rows[0]);
    } catch (error) {
      console.error("Ошибка поиска самоката:", error);
      res.status(500).json({ message: "Ошибка сервера" });
    }
  });

  //получение инфы о конкретном самокате
  router.get("/:id/details", async (req, res) => {
    try {
      const scooterId = req.params.id;
  
      const scooterQuery = `
        SELECT * FROM scooters WHERE id = ?
      `;
      const [scooterRows] = await db.query(scooterQuery, [scooterId]);
  
      if (scooterRows.length === 0) {
        return res.status(404).json({ message: "Самокат не найден" });
      }
  
      const complaintsQuery = `
        SELECT * FROM complaints WHERE scooter_id = ?
      `;
      const [complaintsRows] = await db.query(complaintsQuery, [scooterId]);
  
      const repairsQuery = `
        SELECT repair_timestamp AS timestamp, node, repair_type, success
        FROM repairs WHERE scooter_id = ?
      `;
      const [repairsRows] = await db.query(repairsQuery, [scooterId]);
  
      res.json({
        ...scooterRows[0],
        complaints: complaintsRows,
        repairs: repairsRows,
      });
    } catch (error) {
      console.error("Ошибка получения данных о самокате:", error);
      res.status(500).json({ message: "Ошибка сервера" });
    }
  });
  

module.exports = router;