
const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// 1. 인증번호 발송
router.post('/send-verification', authController.sendVerificationCode);

// 2. 인증번호 검증
router.post('/verify-code', authController.verifyCode);

// 3. 회원가입
router.post('/signup', authController.signup);

// 4. 로그인
router.post('/login', authController.login);


module.exports = router;