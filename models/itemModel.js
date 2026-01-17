const pool = require('../config/db');

// 1. 물품 등록
exports.createItem = async (data) => {
    // 컨트롤러에서 넘어온 데이터
    const { userId, title, description, category, startPrice, startTime, endTime } = data;
    
    // DB 쿼리는 이미 snake_case로 잘 짜여져 있음 (수정 불필요)
    const [result] = await pool.execute(
        `INSERT INTO items 
        (user_id, title, description, category, start_price, current_price, start_time, end_time) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [userId, title, description, category, startPrice, startPrice, startTime, endTime]
    );
    return result.insertId;
};

exports.linkImagesToItem = async (fileIds, itemId) => {
    if (!fileIds || fileIds.length === 0) return;

    const placeholders = fileIds.map(() => '?').join(',');
    
    await pool.execute(
        `UPDATE files SET item_id = ? WHERE id IN (${placeholders})`,
        [itemId, ...fileIds]
    );
};