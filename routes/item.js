const express = require('express');
const router = express.Router();
const itemController = require('../controllers/itemController');
const authMiddleware = require('../middleware/auth');

// POST /api/items
router.post('/', authMiddleware, itemController.createItem);

// GET /api/items
router.get('/', itemController.getItems);

// GET /api/items/:id
router.get('/:id', itemController.getItemDetail);

module.exports = router;