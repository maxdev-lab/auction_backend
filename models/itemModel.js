const pool = require('../config/db');

// 1. 물품 등록
exports.createItem = async (data) => {

    const { userId, title, description, category, startPrice, startTime, endTime } = data;
    
    const [result] = await pool.execute(
        `INSERT INTO items 
        (user_id, title, description, category, start_price, current_price, start_time, end_time) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [userId, title, description, category, startPrice, startPrice, startTime, endTime]
    );
    return result.insertId;
};

// 2. 이미지 연결
exports.linkImagesToItem = async (fileIds, itemId) => {
    if (!fileIds || fileIds.length === 0) return;

    const placeholders = fileIds.map(() => '?').join(',');
    
    await pool.execute(
        `UPDATE files SET item_id = ? WHERE id IN (${placeholders})`,
        [itemId, ...fileIds]
    );
};

// 3. 물품 전체 조회 (썸넬 추가 쿼리)
exports.findAll = async () => {
  const [rows] = await pool.execute(
    `
    SELECT 
      i.*, 
      (SELECT id FROM files f WHERE f.item_id = i.id LIMIT 1) AS thumbnail_id
    FROM items i
    ORDER BY i.created_at DESC
    `
  );
  return rows;
};

// 4. 물품 상세 조회
exports.findById = async (id) => {
  const [rows] = await pool.execute(
    `SELECT * FROM items WHERE id = ?`, 
    [id]
  );
  return rows[0];
};

// 5. 특정 물품의 이미지들 가져오기 
exports.findImagesByItemId = async (itemId) => {
  const [rows] = await pool.execute(
    `SELECT id, file_path FROM files WHERE item_id = ?`,
    [itemId]
  );
  return rows;
};