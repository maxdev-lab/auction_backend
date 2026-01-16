const express = require('express');
const router = express.Router();
const fileController = require('../controllers/fileController');
const authMiddleware = require('../middleware/auth');
const { uploadImage } = require('../config/upload');

// 1. 이미지 업로드
router.post('/', authMiddleware, uploadImage.single('file'), fileController.upload);

// 2. 이미지 보기 (HTML <img> 태그 src용)
router.get('/:id', fileController.viewFile);

module.exports = router;