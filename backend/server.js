const dotenv = require('dotenv');
dotenv.config(); // ← ראשון לפני הכל!

const express = require('express');
const cors = require('cors');
const pool = require('./config/db');
const errorHandler = require('./middleware/errorHandler');
const pollRoutes = require("./routes/pollRoutes");

const app = express();

app.use(cors());
app.use(express.json());

// app.get("/", (req, res) => {
//   res.send("Poll System API is running");
// });

app.use("/polls", pollRoutes);
app.use(errorHandler);

pool.query("SELECT NOW()")
  .then(() => console.log("Database connected successfully"))
  .catch((error) => console.log("Database connection failed", error));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
