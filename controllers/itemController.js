const Item = require('../models/itemModel');

// 물품 등록
exports.createItem = async (req, res) => {
    try {
        const { 
            title, 
            description, 
            category, 
            startPrice, 
            startTime, 
            endTime, 
            imageIds 
        } = req.body;

        const userId = req.user.id; 

        // 1. 필수 값 체크
        if (!title || !startPrice || !endTime) {
            return res.status(400).json({ message: '필수 정보를 모두 입력해주세요.' });
        }

        // 2. 아이템 생성 (DB Insert)
        const newItemId = await Item.createItem({
            userId,
            title,
            description,
            category,
            startPrice,
            startTime: startTime || new Date(), // 없으면 현재시간
            endTime
        });

        // 3. 이미지 연결 (업로드해둔 파일들에 item_id를 박아줌)
        if (imageIds && imageIds.length > 0) {
            await Item.linkImagesToItem(imageIds, newItemId);
        }

        res.status(201).json({
            message: '물품이 성공적으로 등록되었습니다.',
            itemId: newItemId
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: '물품 등록 실패' });
    }
};