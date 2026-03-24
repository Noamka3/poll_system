const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors'); // talk to front
const pool = require('./config/db');
dotenv.config();



const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Poll System API is running");
});

app.get("/test-db", async (req, res) => {
  try {
    const result = await pool.query("SELECT NOW()");
    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Database connection failed" });
  }
});

const PORT = 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
