const nodemailer = require('nodemailer');
const dotenv = require('dotenv');

dotenv.config();

const transporter = nodemailer.createTransport({
    service: 'gmail', 
    auth: {
        user: process.env.MAIL_USER, // 구글 이메일
        pass: process.env.MAIL_PASS, // 앱 비밀번호
    },
});

module.exports = transporter;