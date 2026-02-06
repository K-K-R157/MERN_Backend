const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  port: 587,          // ✅ IMPORTANT
  secure: false,  
  auth: {
    user: process.env.FROM_EMAIL,
    pass: "utbo kaas gtlh qdva", // 16-char app password
  },    
});

module.exports = transporter;
