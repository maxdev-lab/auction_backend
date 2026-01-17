const pool = require('../config/db');

// 1. 입찰하기 
exports.createBid = async (userId, itemId, newPrice) => {
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction(); 

    // bids 테이블에 기록 남기기
    await connection.execute(
      `INSERT INTO bids (user_id, item_id, bid_price) VALUES (?, ?, ?)`,
      [userId, itemId, newPrice]
    );

    // current_price 갱신
    await connection.execute(
      `UPDATE items SET current_price = ? WHERE id = ?`,
      [newPrice, itemId]
    );

    await connection.commit(); 
    return true;
  } catch (err) {
    await connection.rollback(); 
    throw err;
  } finally {
    connection.release();
  }
};

// 2. 특정 물품의 입찰 내역 조회
exports.getBidsByItemId = async (itemId) => {
  const [rows] = await pool.execute(
    `SELECT 
        b.*, 
        u.email, 
        SUBSTRING_INDEX(u.email, '@', 1) AS nickname -- ★ 이메일 @ 앞부분만 잘라서 닉네임으로 사용!
     FROM bids b
     JOIN users u ON b.user_id = u.user_id
     WHERE b.item_id = ?
     ORDER BY b.bid_price DESC`, 
    [itemId]
  );
  return rows;
};

// 3. 입찰 횟수 확인용(첫 입찰일때부터 증가한 금액으로 시작해서 추가함)
exports.getBidCount = async (itemId) => {
  const [rows] = await pool.execute(
    'SELECT COUNT(*) as count FROM bids WHERE item_id = ?', 
    [itemId]
  );
  return rows[0].count;
};