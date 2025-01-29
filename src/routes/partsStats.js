const express = require('express');
const db = require('../config/db');
const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const { start_date, end_date, sort_by, order } = req.query;
    
    let query = `
      SELECT p.id, p.name, SUM(r.repair_type = 'with_parts') AS repairs_with_parts
      FROM parts p
      LEFT JOIN repairs r ON p.id = r.part_id
      GROUP BY p.id`;
    
    //фильтрация по дате
    if (start_date) {
      query += ` AND r.repair_timestamp >= '${start_date}'`;
    }
    if (end_date) {
      query += ` AND r.repair_timestamp <= '${end_date}'`;
    }

    query += ` GROUP BY p.id`;

    //сортировка по правильным полям, как в stats
    if (sort_by && order) {
        const validSortFields = ['repairs_with_parts', 'name'];
        if (validSortFields.includes(sort_by)) {
          query += ` ORDER BY ${sort_by} ${order.toUpperCase()}`;
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
