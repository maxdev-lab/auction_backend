const Item = require('../models/itemModel');

// 물품 등록
exports.createItem = async (req, res) => {
    try {
        const { 
            title, 
            description, 
            category, 
            start_price,  
            start_time,  
            end_time,      
            image_ids     
        } = req.body;

        const userId = req.user.user_id; 

        // 1. 필수 값 체크
        if (!title || !start_price || !end_time) {
            return res.status(400).json({ message: '제목, 시작가, 종료시간은 필수입니다.' });
        }

        // 2. 아이템 생성 
        const newItemId = await Item.createItem({
            userId,
            title,
            description,
            category,
            startPrice: start_price, 
            startTime: start_time || new Date(),
            endTime: end_time
        });

        // 3. 이미지 연결
        if (image_ids && image_ids.length > 0) {
            await Item.linkImagesToItem(image_ids, newItemId);
        }

        res.status(201).json({
            code: 201,
            message: '물품이 성공적으로 등록되었습니다.',
            data: {
                item_id: newItemId  
            }
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: '물품 등록 실패' });
    }
};