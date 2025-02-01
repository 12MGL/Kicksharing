const express = require('express');
const pool = require('../config/db');
const db = require('../config/db');
const router = express.Router();


router.get('/', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM repairs'); // получаем список всех ремонтов
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database error' });
  }
});

//получаем инфу о конкретном ремонте
router.get('/:id', async (req, res) => {
    const { id } = req.params;
  
    try {
      const [rows] = await db.query('SELECT * FROM repairs WHERE id = ?', [id]);
      if (rows.length === 0) {
        return res.status(404).json({ error: 'Repair not found' });
      }
      res.json(rows[0]);                                            //получаем запрошенный ремонт по id
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Database error' });
    }
  });

//на случай, если ремонтник ошибся с данными о ремонте, оставляем возможность изменять их
router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { node, repair_type, success } = req.body;

    if (!id) {
      return res.status(400).json({ message: "ID ремонта обязателен." });
    }

    if (success === undefined) {
      return res.status(400).json({ message: "Поле 'success' обязательно." });
    }

    console.log(`Получен запрос на обновление ремонта ID ${id}`);
    console.log("Данные из запроса:", { node, repair_type, success });

    const query = `
      UPDATE repairs 
      SET node = ?, repair_type = ?, success = ? 
      WHERE id = ?`;

    const [result] = await db.query(query, [
      node || null, 
      repair_type || null, 
      success, 
      id
    ]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Ремонт не найден" });
    }

    res.json({ success: true, message: "Ремонт обновлён!" });
    } catch (error) {
      console.error("Ошибка при обновлении ремонта:", error);
      res.status(500).json({ message: "Ошибка сервера" });
    }
  });


  //добавление нового ремонта 
  router.post("/", async (req, res) => {
    try {
      const { scooter_id, repairman_id, service_center_id, repair_timestamp, node, repair_type, success } = req.body;

      console.log("Данные от фронта:", req.body);  //дебажноэ

      if (!scooter_id || !repairman_id || !repair_timestamp || !node || !repair_type || success === undefined) {
        return res.status(400).json({ error: "Missing required fields" });
    }
  
      console.log("Получен запрос на добавление ремонта:");
      console.log({ scooter_id, repairman_id, success }); //дебажноэ
  
      const query = `
        INSERT INTO repairs (scooter_id, repairman_id, service_center_id, repair_timestamp, node, repair_type, success) 
        VALUES (?, ?, ?, ?, ?, ?, ?)
      `;
  
      console.log("SQL Запрос:", query);  //дебажноэ
      console.log("Параметры:", [   //дебажноэ
          scooter_id, 
          repairman_id, 
          service_center_id ?? null, //если вдруг service_center_id не пришёл, передаём NULL
          repair_timestamp, 
          node, 
          repair_type, 
          success
      ]);

      const [result] = await db.query(query, [
        scooter_id, 
        repairman_id, 
        service_center_id ?? null, //если вдруг service_center_id не пришёл, передаём NULL
        repair_timestamp, 
        node, 
        repair_type, 
        success
    ]);
  
      //res.json({ success: true, message: "Ремонт успешно добавлен!", repair_id: result.insertId });
      res.json({ success: true, message: "Ремонт успешно добавлен!", insertId: result.insertId });

    } catch (error) {
      console.error("Ошибка при добавлении ремонта:", error);
      res.status(500).json({ message: "Ошибка сервера" });
    }
  });

  module.exports = router;
