const express = require('express');
const router = express.Router();
const itemController = require('../controllers/itemController');
const authMiddleware = require('../middleware/auth');
const bidController = require('../controllers/bidController');

// 1. 물품 등록
router.post('/', authMiddleware, itemController.createItem);

// 2. 물품 전체조회
router.get('/', authMiddleware, itemController.getItems);

// 3. 물품 상세조회
router.get('/:id', authMiddleware, itemController.getItem);

// 4. 물품 입찰 
router.post('/:id/bids', authMiddleware, bidController.placeBid);

// 5. 해당 물품 입찰 내역 조회 
router.get('/:id/bids', bidController.getBids);

// 6. 해당 물품 찜 (토글) 
router.post('/:id/likes', authMiddleware, itemController.toggleLike);

module.exports = router;