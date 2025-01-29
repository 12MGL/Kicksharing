const express = require('express');
const db = require('../config/db'); 
const router = express.Router();


router.get('/', async (req, res) => {
    try {
      const { start_date, end_date, sort_by, order } = req.query;
      
      let query = `SELECT * FROM repairs WHERE 1=1`;
      
      //фильтрация по дате
      if (start_date) {
        query += ` AND repair_timestamp >= '${start_date}'`;
      }
      if (end_date) {
        query += ` AND repair_timestamp <= '${end_date}'`;
      }
      
      //сортировка
      if (sort_by && order) {
        //сортировка только по правильным полям
        const validSortFields = ['repair_timestamp', 'success']; //если нужно - расширим список правильных полей для сортировки
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
