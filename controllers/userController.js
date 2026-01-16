const User = require('../models/userModel');

// 1. 내 정보 조회
exports.getMyInfo = async (req, res) => {
    try {
        const userId = req.user.id;
        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({
                code: 404,
                message: '사용자를 찾을 수 없습니다.'
            });
        }

        res.status(200).json({
            code: 200,
            data: {
                userId: user.user_id,            
                email: user.email,
                nickname: user.nickname,    
                createdAt: user.created_at  
            }
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({
            code: 500,
            message: '서버 오류'
        });
    }
};