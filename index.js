const express = require("express");
const path = require("path");

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

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "public")));

app.use("/auth", require("./routes/auth.route"));
app.use("/post", require("./routes/post.route"));
app.use("/user", require("./routes/user.route"));
app.use("/", require("./routes/common.route"));

// const seedDB = require("./seeddb");
// seedDB();

try {
  app.listen(PORT, () => {
    console.log(`Listening to port ${PORT}`);
  });
} catch (error) {
  console.error("Error starting server:", error);
}
