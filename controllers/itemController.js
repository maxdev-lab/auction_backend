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
    const userId = req.user.user_id;

    const items = await itemModel.findAll(userId);

    const result = items.map(item => ({
      ...item,
      is_liked: !!item.is_liked, 
      
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

//  상세 조회
exports.getItem = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.user_id; 

    const item = await itemModel.findById(id, userId);
    if (!item) {
      return res.status(404).json({ message: '물품이 존재하지 않습니다.' });
    }

    const images = await itemModel.findImagesByItemId(id);

    const imagesWithUrl = images.map(img => ({
      id: img.id,
      url: `${req.protocol}://${req.get('host')}/api/files/${img.id}`
    }));

    const result = {
      ...item,
      is_liked: !!item.is_liked, 
      images: imagesWithUrl 
    };

    res.json(result);

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: '서버 오류' });
  }
};

// 찜 누르기(토글)
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

// 물품 수정
exports.updateItem = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.user_id;
    const { title, description, category, end_time, status, fileIds, image_ids } = req.body;
    
    const newImages = fileIds || image_ids; 

    const item = await itemModel.findById(id, userId);
    if (!item) return res.status(404).json({ message: '물품이 존재하지 않습니다.' });

    if (item.user_id !== userId) return res.status(403).json({ message: '본인의 물품만 수정할 수 있습니다.' });

    await itemModel.updateItem(id, {
      title: title || item.title,
      description: description || item.description,
      category: category || item.category,
      end_time: end_time || item.end_time,
      status: status || item.status
    });

    if (newImages) {
      await itemModel.updateItemImages(id, newImages);
    }

    res.json({ message: '수정이 완료되었습니다.' });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: '서버 오류' });
  }
};

// 물품 삭제 
exports.deleteItem = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.user_id;

    const item = await itemModel.findById(id, userId);
    if (!item) {
      return res.status(404).json({ message: '물품이 존재하지 않습니다.' });
    }

    if (item.user_id !== userId) {
      return res.status(403).json({ message: '본인의 물품만 삭제할 수 있습니다.' });
    }

    await itemModel.deleteItem(id);

    res.json({ message: '삭제가 완료되었습니다.' });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: '서버 오류' });
  }
};