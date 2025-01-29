const express = require('express');
const db = require('../config/db');
const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const { start_date, end_date, sort_by, order } = req.query;
    
    let query = `
      SELECT u.id, u.username, COUNT(r.id) AS total_repairs, 
             SUM(r.success = 1) AS successful_repairs, 
             SUM(r.success = 0) AS failed_repairs
      FROM users u
      LEFT JOIN repairs r ON u.id = r.repairman_id
      WHERE u.role = 'repairman'`;
    
    //фильтрация по дате
    if (start_date) {
      query += ` AND r.repair_timestamp >= '${start_date}'`;
    }
    if (end_date) {
      query += ` AND r.repair_timestamp <= '${end_date}'`;
    }
    
    query += ` GROUP BY u.id`;

    //сортировка только по правильным полям, как в stats
    if (sort_by && order) {
        const validSortFields = ['total_repairs', 'successful_repairs', 'failed_repairs'];
        if (validSortFields.includes(sort_by)) {
          query += ` GROUP BY u.id ORDER BY ${sort_by} ${order.toUpperCase()}`;
        }
      }

    const [results] = await db.query(query);
    res.json(results);
  } catch (error) {
    console.error(error);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
