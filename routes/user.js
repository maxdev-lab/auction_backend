const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const authMiddleware = require('../middleware/auth'); 

// 1. 내 정보 조회 
router.get('/me', authMiddleware, userController.getMyInfo);

// 2. 내가 찜 한 목록 조회
router.get('/me/likes', authMiddleware, userController.getMyLikes);

// 3. 판매 내역
router.get('/me/items', authMiddleware, userController.getMyItems);

// 4. 입찰 내역
router.get('/me/bids', authMiddleware, userController.getMyBiddedItems);

// 5. 특정 물품에 대한 나의 입찰 상세 기록
router.get('/me/bids/:id', authMiddleware, userController.getMyBidDetail);

module.exports = router;