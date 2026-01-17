const fileModel = require('../models/fileModel');
const fs = require('fs'); // ★ 파일 삭제를 위해 필수!
const path = require('path');

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

    const { originalname, filename, path: filePath, size } = req.file;
    
    const normalizedPath = filePath.replace(/\\/g, '/');

    const fileId = await fileModel.createFile({
      originalName: originalname,
      storedName: filename,
      filePath: normalizedPath,
      size: size
    });

    res.status(201).json({
      message: '파일 업로드 성공',
      data: { 
        id: fileId,
        url: `${req.protocol}://${req.get('host')}/api/files/${fileId}` // 이미지 바로보기 URL
      }
    });

  } catch (err) {
    console.error('파일 업로드 에러:', err);

    // DB 저장 실패 시, 방금 업로드된 물리 파일 삭제 (롤백)
    if (req.file && req.file.path) {
        fs.unlink(req.file.path, (unlinkErr) => {
            if (unlinkErr) console.error('파일 삭제 실패:', unlinkErr);
        });
    }

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

    if (!fs.existsSync(file.file_path)) { 
      return res.status(404).json({ message: '실제 파일이 존재하지 않습니다' });
    }

    res.sendFile(path.resolve(file.file_path));
    
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: '서버 오류가 발생했습니다' });
  }
};