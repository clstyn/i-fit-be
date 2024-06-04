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

app.get("/", (req, res) => {
  res.send("Welcome to the I-Fit server!");
});

try {
  app.listen(PORT, () => {
    console.log(`Listening to port ${PORT}`);
  });
} catch (error) {
  console.error("Error starting server:", error);
}
