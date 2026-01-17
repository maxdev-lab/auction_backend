const pool = require('../config/db');

// 입찰하기 (DB 트랜잭션: 입찰기록 저장 + 물품 현재가 갱신)
exports.createBid = async (userId, itemId, newPrice) => {
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction(); // 안전장치 시작

    // 1. bids 테이블에 기록 남기기
    await connection.execute(
      `INSERT INTO bids (user_id, item_id, bid_price) VALUES (?, ?, ?)`,
      [userId, itemId, newPrice]
    );

    // 2. items 테이블의 current_price 변경하기
    await connection.execute(
      `UPDATE items SET current_price = ? WHERE id = ?`,
      [newPrice, itemId]
    );

    await connection.commit(); // 저장 확정
    return true;
  } catch (err) {
    await connection.rollback(); // 실패하면 되돌리기
    throw err;
  } finally {
    connection.release();
  }
};

// 특정 물품의 입찰 내역 조회
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