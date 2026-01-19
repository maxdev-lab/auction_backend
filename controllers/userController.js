const User = require("../models/userModel");
const likeModel = require('../models/likeModel');
const itemModel = require('../models/itemModel');
const bidModel = require('../models/bidModel');
const bcrypt = require("bcrypt");

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

// 내가 판매 중인(등록한) 내역 조회
exports.getMyItems = async (req, res) => {
  try {
    const userId = req.user.user_id;
    const items = await itemModel.findByUserId(userId);

    const result = items.map(item => ({
      ...item,
      thumbnail_url: item.thumbnail_id 
        ? `${req.protocol}://${req.get('host')}/api/files/${item.thumbnail_id}`
        : null
    }));

    res.json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: '서버 오류' });
  }
};

// 나의 입찰 내역 조회
exports.getMyBiddedItems = async (req, res) => {
  try {
    const userId = req.user.user_id;
    
    const items = await bidModel.findBiddedItems(userId);

    const result = items.map(item => ({
      ...item,
      thumbnail_url: item.thumbnail_id 
        ? `${req.protocol}://${req.get('host')}/api/files/${item.thumbnail_id}`
        : null
    }));

    res.json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: '서버 오류' });
  }
};


// 특정 물품의 내 입찰 기록
exports.getMyBidDetail = async (req, res) => {
  try {
    const userId = req.user.user_id;
    const { id } = req.params;

    const history = await bidModel.findMyBidsForItem(userId, id);
    
    res.json(history);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: '서버 오류' });
  }
};

// 내가 판매 중인(등록한) 내역 조회
exports.getMyItems = async (req, res) => {
  try {
    const userId = req.user.user_id;

    const items = await itemModel.findByUserId(userId);

    // 데이터 가공 (썸네일 URL 만들기)
    const result = items.map(item => ({
      ...item,
      thumbnail_url: item.thumbnail_id 
        ? `${req.protocol}://${req.get('host')}/api/files/${item.thumbnail_id}`
        : null
    }));

    res.json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: '서버 오류' });
  }
};

exports.updateProfile = async (req, res) => {
  try {
    const userId = req.user.user_id; 
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({ message: '현재 비밀번호와 새 비밀번호를 모두 입력해주세요.' });
    }

    const user = await User.findByIdWithPassword(userId);
    if (!user) {
      return res.status(404).json({ message: '사용자를 찾을 수 없습니다.' });
    }

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    
    if (!isMatch) {
      return res.status(401).json({ message: '현재 비밀번호가 일치하지 않습니다.' });
    }

    const saltRounds = 10; 
    const hashedNewPassword = await bcrypt.hash(newPassword, saltRounds);

    await User.updatePassword(userId, hashedNewPassword);

    res.json({ message: '비밀번호가 성공적으로 변경되었습니다.' });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: '서버 오류' });
  }
};