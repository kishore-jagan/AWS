const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { Sequelize, DataTypes } = require('sequelize');
const { connectDB,pool} = require('./db');
const userRouter = require('./router')

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(bodyParser.json());
app.use(cors());

connectDB();

app.use('/api', userRouter);

// app.get('/api/data', async (req, res) => {
//     try {
//         console.log("Querying database...");
//         const result = await pool.query('SELECT * FROM ecfs_data');
//         res.json(result.rows);
//     } catch (err){
//         console.error('Error fetching data:', err);
//         res.status(500).json({error: 'Failed to fetch data' })
//     }
// });

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});



