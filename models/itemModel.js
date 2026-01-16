const pool = require('../config/db');

// 1. 물품 등록
exports.createItem = async (data) => {
    const { userId, title, description, category, startPrice, startTime, endTime } = data;
    
    // current_price는 처음에 start_price와 같게 설정
    const [result] = await pool.execute(
        `INSERT INTO items 
        (user_id, title, description, category, start_price, current_price, start_time, end_time) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [userId, title, description, category, startPrice, startPrice, startTime, endTime]
    );
    return result.insertId;
};

// 2. 파일 테이블에 item_id 업데이트 (사진 연결)
exports.linkImagesToItem = async (fileIds, itemId) => {
    if (!fileIds || fileIds.length === 0) return;

    const placeholders = fileIds.map(() => '?').join(',');
    
    await pool.execute(
        `UPDATE files SET item_id = ? WHERE id IN (${placeholders})`,
        [itemId, ...fileIds]
    );
};