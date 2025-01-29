const express = require('express');
const router = express.Router();
const db = require('../config/db');

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
      const query = `
        INSERT INTO scooters (serial_number, registration_number, model, year, color, mileage, status)
        VALUES (?, ?, ?, ?, ?, ?, ?)`;
      
      const [result] = await db.query(query, [serial_number, registration_number, model, year, color, mileage, status]);
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
      
      const query = `
        UPDATE scooters
        SET serial_number = ?, registration_number = ?, model = ?, year = ?, color = ?, mileage = ?, status = ?
        WHERE id = ?`;
      
      const [result] = await db.query(query, [serial_number, registration_number, model, year, color, mileage, status, scooterId]);
      
      if (result.affectedRows === 0) {
        return res.status(404).json({ message: 'Scooter not found' });
      }
      
      res.json({ message: 'Scooter updated successfully!' });
    } catch (error) {
      console.error(error);
      res.status(500).send('Server Error');
    }
  });
  

module.exports = router;