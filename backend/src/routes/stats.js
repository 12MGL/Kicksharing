const express = require('express');
const db = require('../config/db'); 
const router = express.Router();


router.get('/', async (req, res) => {
    try {
      const { start_date, end_date, sort_by, order } = req.query;
      
      //let query = `SELECT * FROM repairs WHERE 1=1`; 
      const query = `
        SELECT 
          r.id, 
          r.repair_timestamp, 
          r.node, 
          r.repair_type, 
          r.success,
          r.scooter_id, 
          s.serial_number AS scooter_serial_number, 
          s.registration_number AS scooter_registration_number,
          r.repairman_id, 
          u.username AS repairman_name,
          sc.id AS service_center_id, 
          sc.name AS service_center_name
        FROM repairs r
        JOIN scooters s ON r.scooter_id = s.id
        JOIN users u ON r.repairman_id = u.id
        LEFT JOIN service_centers sc ON r.service_center_id = sc.id
        ORDER BY r.repair_timestamp DESC;
      `;

      
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
  
      const [rows] = await db.query(query);
      res.json(rows);
    } catch (error) {
      console.error(error);
      res.status(500).send('Server Error');
    }
  });

module.exports = router;
