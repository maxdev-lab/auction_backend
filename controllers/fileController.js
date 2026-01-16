const path = require('path');
const fs = require('fs');
const fileModel = require('../models/fileModel');

// 파일 업로드
exports.upload = async (req, res) => {
    /* #swagger.consumes = ['multipart/form-data'] 
       #swagger.parameters['file'] = {
           in: 'formData',
           type: 'file',
           required: true,
           description: '업로드할 이미지 파일'
       } 
    */
  try {
    if (!req.file) {
      return res.status(400).json({ message: '파일을 선택해주세요' });
    }

    // multer가 저장한 정보 꺼내기
    const { originalname, filename, path: filePath, mimetype, size } = req.file;
    // authMiddleware를 통과한 user id
    const userId = req.user.id; 

    // Windows 역슬래시(\) -> 슬래시(/) 변환 (DB 저장용)
    const normalizedPath = filePath.replace(/\\/g, '/');

    // DB에 파일 정보 저장
    const fileId = await fileModel.create(
      originalname,
      filename,
      normalizedPath,
      mimetype,
      size,
      userId
    );

    res.status(201).json({
      message: '파일 업로드 성공',
      data: { 
        id: fileId,
        url: `http://localhost:3000/api/files/${fileId}` // 이미지 바로보기 URL
      }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: '서버 오류가 발생했습니다' });
  }
};

// 이미지 보기 (GET /api/files/:id)
exports.viewFile = async (req, res) => {
  try {
    const { id } = req.params;

    const file = await fileModel.findById(id);
    if (!file) {
      return res.status(404).json({ message: '파일을 찾을 수 없습니다' });
    }

    if (!fs.existsSync(file.path)) {
      return res.status(404).json({ message: '파일이 존재하지 않습니다' });
    }

    res.set('Content-Type', file.mime_type);
    res.sendFile(path.resolve(file.path));
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: '서버 오류가 발생했습니다' });
  }
};