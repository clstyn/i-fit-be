const express = require("express");

const db = require("./models");
db.connectDB();

const dotenv = require("dotenv");
dotenv.config();

const cors = require("cors");

const app = express();
app.use(cors());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const PORT = process.env.PORT || 9000;

try {
  app.listen(PORT, () => {
    console.log(`Listening to port ${PORT}`);
  });
} catch (error) {
  console.error("Error starting server:", error);
}
