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
  
//статистика по ремонтам для админа: общее количество, количество успешных, количество неуспешных ремонтов.
// router.get('/stats', async (req, res) => {
//     try {
//       const [totalRepairs] = await db.query('SELECT COUNT(*) as total FROM repairs');
//       const [successfulRepairs] = await db.query('SELECT COUNT(*) as successful FROM repairs WHERE success = TRUE');
//       const [failedRepairs] = await db.query('SELECT COUNT(*) as failed FROM repairs WHERE success = FALSE');
  
//       res.json({
//         totalRepairs: totalRepairs[0].total,
//         successfulRepairs: successfulRepairs[0].successful,
//         failedRepairs: failedRepairs[0].failed,
//       });
//     } catch (err) {
//       console.error(err);
//       res.status(500).json({ error: 'Database error' });
//     }
//   });
   
//статистика по ремонтНИКАМ для админов. количество ремонтов / количество УСПЕШНЫХ ремонтов
// router.get('/stats/repairmen', async (req, res) => {
//     try {
//       const [repairmanStats] = await db.query(`
//         SELECT users.username, COUNT(repairs.id) as totalRepairs, 
//                SUM(CASE WHEN repairs.success = TRUE THEN 1 ELSE 0 END) as successfulRepairs
//         FROM repairs
//         JOIN users ON repairs.repairman_id = users.id
//         GROUP BY users.username
//       `);
  
//       res.json(repairmanStats);
//     } catch (err) {
//       console.error(err);
//       res.status(500).json({ error: 'Database error' });
//     }
//   });

//статистика складская. количество использованных при ремонтах запчастей / количество оставшихся на складе запчастей
// router.get('/stats/parts', async (req, res) => {
//     try {
//       const [partsStats] = await db.query(`
//         SELECT parts.name, SUM(CASE WHEN repairs.repair_type = 'with_parts' THEN 1 ELSE 0 END) as usedRepairs, 
//                parts.quantity as remainingQuantity
//         FROM repairs
//         JOIN parts ON repairs.node = parts.name
//         GROUP BY parts.name
//       `);
  
//       res.json(partsStats);
//     } catch (err) {
//       console.error(err);
//       res.status(500).json({ error: 'Database error' });
//     }
//   });
  
  

module.exports = router;
