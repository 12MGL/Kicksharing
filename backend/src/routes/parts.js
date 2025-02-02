const express = require('express');
const router = express.Router();
const db = require('../config/db');
const { logAdminAction } = require("../utils/logger");

//добавление новой ЗПЧ
router.post('/', async (req, res) => {
  try {
    const { article, name, quantity } = req.body;
    const adminId = req.headers["admin-id"] || 1; //полуачем id админа для логов, либо "1", если невозможно получить

    const query = `
      INSERT INTO parts (article, name, quantity)
      VALUES (?, ?, ?)`;

    const [result] = await db.query(query, [article, name, quantity]);

    //логируем действия админа
    await logAdminAction(adminId, "добавил запчасть: ", `ID: ${result.insertId}, название: ${name}`);

    res.status(201).json({ id: result.insertId, message: 'Part added successfully!' });
  } catch (error) {
    console.error(error);
    res.status(500).send('Server Error');
  }
});

//получение списка всезх ЗПЧ
router.get('/', async (req, res) => {
  try {
    const query = 'SELECT * FROM parts';
    const [rows] = await db.query(query);
    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).send('Server Error');
  }
});

//получение инфы ЗПЧ по id
router.get('/:id', async (req, res) => {
  try {
    const partId = req.params.id;
    const query = 'SELECT * FROM parts WHERE id = ?';
    const [rows] = await db.query(query, [partId]);

    if (rows.length === 0) {
      return res.status(404).json({ message: 'Part not found' });
    }

    res.json(rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).send('Server Error');
  }
});

//обновление количества ЗПЧ на складе
router.put('/:id', async (req, res) => {
  try {
    const partId = req.params.id;
    const { article, name, quantity } = req.body;
    const adminId = req.headers["admin-id"] || 1; //полуачем id админа для логов, либо "1", если невозможно получить

    const query = `
      UPDATE parts
      SET article = ?, name = ?, quantity = ?
      WHERE id = ?`;

    const [result] = await db.query(query, [article, name, quantity, partId]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Part not found' });
    }
    //логируем действия админа
    await logAdminAction(adminId, "Редактировал запчасть", `ID: ${partId}, название: ${name}`);

    res.json({ message: 'Part updated successfully!' });
  } catch (error) {
    console.error(error);
    res.status(500).send('Server Error');
  }
});

//удаление ЗПЧ
router.delete('/:id', async (req, res) => {
  try {
    const partId = req.params.id;
    const query = 'DELETE FROM parts WHERE id = ?';

    const [result] = await db.query(query, [partId]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Part not found' });
    }

    res.json({ message: 'Part deleted successfully!' });
  } catch (error) {
    console.error(error);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
