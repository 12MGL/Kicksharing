const express = require('express');
const cors = require('cors');
const app = express();
const scootersRoutes = require('./routes/scooters');
const repairsRoutes = require('./routes/repairs');
const statsRoutes = require('./routes/stats');
const repairmenStatsRoutes = require('./routes/repairmenStats');
const partsStatsRoutes = require('./routes/partsStats');
const partsRoutes = require('./routes/parts');
const repairmenRoutes = require('./routes/repairmen');
const logsRoutes = require('./routes/logs');
const authRoutes = require("./routes/auth");


const router = express.Router();

app.use(cors()); //решаем проблему фронта с авторизацией запросов через CORS
app.use(express.json());

// подключаем маршруты, определённые по схеме базовой структуры
app.use('/scooters', scootersRoutes);
app.use('/repairs', repairsRoutes);
app.use('/stats', statsRoutes);
app.use('/repairmen', repairmenRoutes);
app.use('/stats/repairmen', repairmenStatsRoutes);
app.use('/stats/parts', partsStatsRoutes);
app.use('/parts', partsRoutes);
app.use('/logs', logsRoutes);
app.use("/auth", authRoutes);

app.get('/stats', (req, res) => {
    res.send('Statistics page');
  });
app.get('/stats/repairmen', (req, res) => {
    res.send('Repairmen statistics page');
    });
app.get('/stats/parts', (req, res) => {
    res.send('Parts statistics page');
    });



process.on('uncaughtException', function (err) {
    console.log(err);
    });

function isAdmin(req, res, next) { //функция проверки на админство
    const role = req.headers['role']; 
    
    if (role !== 'admin') {
        return res.status(403).json({ error: 'Access denied. Admins only.' });
    }
    
    next();
    }

//порт, старт сервера
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

//статистика по ремонтам для админа: общее количество, количество успешных, количество неуспешных ремонтов.
router.get('/stats', isAdmin, async (req, res) => {
    try {
      const [totalRepairs] = await db.query('SELECT COUNT(*) as total FROM repairs');
      const [successfulRepairs] = await db.query('SELECT COUNT(*) as successful FROM repairs WHERE success = TRUE');
      const [failedRepairs] = await db.query('SELECT COUNT(*) as failed FROM repairs WHERE success = FALSE');
  
      res.json({
        totalRepairs: totalRepairs[0].total,
        successfulRepairs: successfulRepairs[0].successful,
        failedRepairs: failedRepairs[0].failed,
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Database error' });
    }
  });

//статистика по ремонтНИКАМ для админов. количество ремонтов / количество УСПЕШНЫХ ремонтов
router.get('/stats/repairmen', isAdmin, async (req, res) => {
    try {
        const [repairmanStats] = await db.query(`
        SELECT users.username, COUNT(repairs.id) as totalRepairs, 
                SUM(CASE WHEN repairs.success = TRUE THEN 1 ELSE 0 END) as successfulRepairs
        FROM repairs
        JOIN users ON repairs.repairman_id = users.id
        GROUP BY users.username
        `);

        res.json(repairmanStats);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Database error' });
    }
    });

// Статистика по запчастям
router.get('/stats/parts', isAdmin, async (req, res) => {
    try {
      const [partsStats] = await db.query(`
        SELECT parts.name, SUM(CASE WHEN repairs.repair_type = 'with_parts' THEN 1 ELSE 0 END) as usedRepairs, 
               parts.quantity as remainingQuantity
        FROM repairs
        JOIN parts ON repairs.node = parts.name
        GROUP BY parts.name
      `);
  
      res.json(partsStats);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Database error' });
    }
  });
  