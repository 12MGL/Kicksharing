const express = require('express');
const router = express.Router();
const db = require('../config/db');


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
    const { success } = req.body;
  
    if (success === undefined) {
      return res.status(400).json({ error: 'Missing success field' });
    }
  
    try {
      const [result] = await db.query('UPDATE repairs SET success = ? WHERE id = ?', [success, id]);
      if (result.affectedRows === 0) {
        return res.status(404).json({ error: 'Repair not found' });
      }
      res.json({ message: 'Repair updated' });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Database error' });
    }
  });
  
//добавление нового ремонта
router.post('/', async (req, res) => {
    try {
      const { scooter_id, repairman_id, repair_timestamp, node, repair_type, success } = req.body;
      const query = `
        INSERT INTO repairs (scooter_id, repairman_id, repair_timestamp, node, repair_type, success)
        VALUES (?, ?, ?, ?, ?, ?)`;
      
      const [result] = await db.query(query, [scooter_id, repairman_id, repair_timestamp, node, repair_type, success]);
      res.status(201).json({ id: result.insertId, message: 'Repair added successfully!' });
    } catch (error) {
      console.error(error);
      res.status(500).send('Server Error');
    }
  });
  
  
  

module.exports = router;
