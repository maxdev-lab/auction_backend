const express = require('express');
const router = express.Router();
const itemController = require('../controllers/itemController');
const authMiddleware = require('../middleware/auth');

// POST /api/items
router.post('/', authMiddleware, itemController.createItem);

module.exports = router;