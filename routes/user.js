const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const authMiddleware = require('../middleware/auth'); 

// 1. 내 정보 조회 (로그인 필수)
router.get('/me', authMiddleware, userController.getMyInfo);

module.exports = router;