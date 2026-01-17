const User = require("../models/userModel");
const likeModel = require('../models/likeModel');

// 내 정보 조회
exports.getMyInfo = async (req, res) => {
  try {
    const userId = req.user.user_id;
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        code: 404,
        message: "사용자를 찾을 수 없습니다.",
      });
    }

    res.status(200).json({
      code: 200,
      data: {
        user_id: user.user_id,
        email: user.email,
        createdAt: user.created_at,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      code: 500,
      message: "서버 오류",
    });
  }
};

// 찜 한 목록 확인
exports.getMyLikes = async (req, res) => {
  try {
    const userId = req.user.user_id;
    const items = await likeModel.getLikedItems(userId);

    const itemsWithImage = items.map(item => {
      const imageUrl = item.thumbnail_id 
        ? `${req.protocol}://${req.get('host')}/api/files/${item.thumbnail_id}`
        : null;

      return {
        ...item,
        thumbnail_url: imageUrl
      };
    });

    res.json(itemsWithImage);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: '서버 오류' });
  }
};