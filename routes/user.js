const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const authMiddleware = require('../middleware/auth'); 

// 1. 내 정보 조회 
router.get('/me', authMiddleware, userController.getMyInfo);

// 2. 내가 찜 한 목록 조회
router.get('/me/likes', authMiddleware, userController.getMyLikes);

module.exports = router;