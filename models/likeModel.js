const pool = require('../config/db');

// 1. 찜 여부 확인 
exports.checkLike = async (userId, itemId) => {
  const [rows] = await pool.execute(
    'SELECT id FROM likes WHERE user_id = ? AND item_id = ?',
    [userId, itemId]
  );
  return rows.length > 0; 
};

// 2. 찜 하기 
exports.addLike = async (userId, itemId) => {
  await pool.execute(
    'INSERT INTO likes (user_id, item_id) VALUES (?, ?)',
    [userId, itemId]
  );
};

// 3. 찜 취소 
exports.removeLike = async (userId, itemId) => {
  await pool.execute(
    'DELETE FROM likes WHERE user_id = ? AND item_id = ?',
    [userId, itemId]
  );
};

// 4. 내가 찜한 목록 조회
exports.getLikedItems = async (userId) => {
  const [rows] = await pool.execute(
    `SELECT 
        i.*, 
        (SELECT id FROM files f WHERE f.item_id = i.id LIMIT 1) AS thumbnail_id
     FROM likes l
     JOIN items i ON l.item_id = i.id
     WHERE l.user_id = ?
     ORDER BY l.created_at DESC`,
    [userId]
  );
  return rows;
};