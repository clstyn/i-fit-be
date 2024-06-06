const nodemailer = require("nodemailer");

const dotenv = require("dotenv");
dotenv.config();

let transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const connectNodemailer = async () => {
  await transporter
    .verify()
    .then(() => console.log("Connected Nodemailer"))
    .catch((err) => console.log(err));
};

const sendEmail = async (options) => {
  await transporter.sendMail(options);
};

module.exports = { transporter, connectNodemailer, sendEmail };
