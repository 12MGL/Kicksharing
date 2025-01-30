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


//добавление нового ремонта
router.post('/', async (req, res) => {
    const { scooter_id, repairman_id, repair_timestamp, node, repair_type, success } = req.body;
  
    if (!scooter_id || !repairman_id || !repair_timestamp || !node || !repair_type || success === undefined) {
      return res.status(400).json({ error: 'Missing required fields' }); //типичная проверка на заполнение всех полей
    }
  
    try {
      const [result] = await db.query(
        'INSERT INTO repairs (scooter_id, repairman_id, repair_timestamp, node, repair_type, success) VALUES (?, ?, ?, ?, ?, ?)',
        [scooter_id, repairman_id, repair_timestamp, node, repair_type, success] //в repairs добавляем данные о ремонте
      );
      res.status(201).json({ message: 'Repair created', id: result.insertId });
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
router.put('/:id', async (req, res) => {
    const { id } = req.params;
    const { repair_timestamp, node, repair_type, success } = req.body;
  
    if (success === undefined) {
      return res.status(400).json({ error: 'Missing success field' });
    }
  
    try {
      console.log(`Получен запрос на обновление ремонта ID ${id}`);   //дебажноэ
        console.log("Данные из запроса:", req.body);   //дебажноэ

        const [result] = await db.execute(
            "UPDATE repairs SET repair_timestamp = ?, node = ?, repair_type = ?, success = ? WHERE id = ?",
            [repair_timestamp, node, repair_type, success, id]
        );

        console.log("Результат выполнения запроса:", result);   //дебажноэ

        if (result.affectedRows > 0) {
            console.log(`Успешно обновлено: ${result.affectedRows} строк`);
            res.status(200).json({ message: "Данные успешно обновлены" });
        } else {
            console.log("Ошибка: запись не найдена.");
            res.status(404).json({ message: "Ремонт не найден" });
        }
    } catch (error) {
        console.error("Ошибка при обновлении ремонта:", error);
        res.status(500).json({ message: "Ошибка сервера", error: error.message });
    }
  });

  module.exports = router;
