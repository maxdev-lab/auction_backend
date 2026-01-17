const express = require('express');
const router = express.Router();
const itemController = require('../controllers/itemController');
const authMiddleware = require('../middleware/auth');
const bidController = require('../controllers/bidController');

// POST /api/items
router.post('/', authMiddleware, itemController.createItem);

// GET /api/items
router.get('/', itemController.getItems);

// GET /api/items/:id
router.get('/:id', itemController.getItemDetail);

// POST /api/items/1/bids 
router.post('/:id/bids', authMiddleware, bidController.placeBid);

// GET /api/items/1/bids 
router.get('/:id/bids', bidController.getBids);

module.exports = router;