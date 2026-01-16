const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

/**
 * @swagger
 * tags:
 * name: Auth
 * description: 회원가입 및 이메일 인증
 */

/**
 * @swagger
 * /api/auth/send-verification:
 * post:
 * summary: 학교 이메일 인증번호 발송
 * tags: [Auth]
 * requestBody:
 * required: true
 * content:
 * application/json:
 * schema:
 * type: object
 * required:
 * - email
 * properties:
 * email:
 * type: string
 * description: 학교 이메일
 * example: student@tukorea.ac.kr
 * responses:
 * 200:
 * description: 인증번호 발송 성공
 * 400:
 * description: 학교 이메일이 아님
 * 409:
 * description: 이미 가입된 이메일
 */
router.post('/send-verification', authController.sendVerificationCode);

/**
 * @swagger
 * /api/auth/verify-code:
 * post:
 * summary: 인증번호 검증
 * tags: [Auth]
 * requestBody:
 * required: true
 * content:
 * application/json:
 * schema:
 * type: object
 * required:
 * - email
 * - code
 * properties:
 * email:
 * type: string
 * example: student@tukorea.ac.kr
 * code:
 * type: string
 * description: 인증번호 6자리
 * example: "123456"
 * responses:
 * 200:
 * description: 인증 성공
 * 400:
 * description: 잘못된 인증번호
 */
router.post('/verify-code', authController.verifyCode);

/**
 * @swagger
 * /api/auth/signup:
 * post:
 * summary: 최종 회원가입
 * tags: [Auth]
 * requestBody:
 * required: true
 * content:
 * application/json:
 * schema:
 * type: object
 * required:
 * - email
 * - password
 * properties:
 * email:
 * type: string
 * example: student@tukorea.ac.kr
 * password:
 * type: string
 * example: mypassword123
 * responses:
 * 201:
 * description: 회원가입 성공
 * 401:
 * description: 이메일 인증 안됨
 * 409:
 * description: 이미 존재하는 계정
 */
router.post('/signup', authController.signup);

module.exports = router;