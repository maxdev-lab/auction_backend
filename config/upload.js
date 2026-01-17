const multer = require("multer");
const path = require("path");
const crypto = require("crypto");
const fs = require("fs");

// 저장 경로 생성 (storage/yyyy/mmdd/)
const getUploadPath = () => {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");

  // 프로젝트 루트 기준 storage 폴더 사용
  const uploadPath = path.join("storage", String(year), `${month}${day}`);

  // 디렉토리 없으면 생성
  if (!fs.existsSync(uploadPath)) {
    fs.mkdirSync(uploadPath, { recursive: true });
  }

  return uploadPath;
};

// 파일명 생성
const generateFileName = (originalName) => {
  const ext = path.extname(originalName).toLowerCase();
  const randomName = crypto.randomBytes(4).toString("hex");
  return `${randomName}${ext}`;
};

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = getUploadPath();
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const fileName = generateFileName(file.originalname);
    cb(null, fileName);
  },
});

// 파일 필터
const imageFilter = (req, file, cb) => {
  const allowedTypes = [
    "image/jpeg",
    "image/png",
    "image/gif",
    "image/webp",
    "image/jpg",
  ];

  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(
      new Error("이미지 파일만 업로드 가능합니다 (jpeg, png, gif, webp)"),
      false
    );
  }
};

// 이미지 업로드 설정
const uploadImage = multer({
  storage,
  fileFilter: imageFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB
  },
});

module.exports = { uploadImage };
