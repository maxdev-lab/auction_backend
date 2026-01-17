const itemModel = require('../models/itemModel'); 
const likeModel = require('../models/likeModel');

// 물품 등록
exports.createItem = async (req, res) => {
    try {
        const { title, description, category, start_price, end_time } = req.body;
        const userId = req.user.user_id;
        
        // 시간 설정 (없으면 현재 시간)
        const startTime = req.body.start_time || new Date();
        const endTime = new Date(end_time);

        // 물품 만들기 
        const itemId = await itemModel.createItem({
            userId,
            title,
            description,
            category,
            startPrice: start_price,
            startTime,
            endTime
        });

        // 이미지 연결하기
        const { image_ids } = req.body;
        if (image_ids && image_ids.length > 0) {
            await itemModel.linkImagesToItem(image_ids, itemId);
        }

        res.status(201).json({ 
            message: '물품이 등록되었습니다.',
            data: { itemId }
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: '서버 오류' });
    }
};

// 전체 목록 조회
exports.getItems = async (req, res) => {
  try {
    const items = await itemModel.findAll();

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

//  상세 조회
exports.getItemDetail = async (req, res) => {
  try {
    const { id } = req.params;

    const item = await itemModel.findById(id);
    if (!item) {
      return res.status(404).json({ message: '물품을 찾을 수 없습니다.' });
    }

    const images = await itemModel.findImagesByItemId(id);

    const itemWithImages = {
        ...item,
        images: images.map(img => ({
            id: img.id,
            url: `${req.protocol}://${req.get('host')}/api/files/${img.id}`
        }))
    };

    res.json(itemWithImages);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: '서버 오류' });
  }
};

exports.toggleLike = async (req, res) => {
  try {
    const userId = req.user.user_id;
    const itemId = req.params.id;

    const isLiked = await likeModel.checkLike(userId, itemId);

    if (isLiked) {
      await likeModel.removeLike(userId, itemId);
      return res.status(200).json({ message: '찜 취소', liked: false });
    } else {
      await likeModel.addLike(userId, itemId);
      return res.status(201).json({ message: '찜 설정', liked: true });
    }

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: '서버 오류' });
  }
};