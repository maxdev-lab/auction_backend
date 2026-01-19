const pool = require("../config/db");

// 1. 물품 등록
exports.createItem = async (data) => {
  const { userId, title, description, category, startPrice, startTime, endTime } = data;
  
  const [result] = await pool.execute(
    `INSERT INTO items 
    (user_id, title, description, category, start_price, current_price, start_time, end_time) 
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      userId,
      title,
      description,
      category,
      startPrice,
      startPrice,
      startTime,
      endTime,
    ]
  );
  return result.insertId;
};


// 2. 이미지 연결
exports.linkImagesToItem = async (fileIds, itemId) => {
  if (!fileIds || fileIds.length === 0) return;

  const placeholders = fileIds.map(() => "?").join(",");

  await pool.execute(
    `UPDATE files SET item_id = ? WHERE id IN (${placeholders})`,
    [itemId, ...fileIds],
  );
};

// 3. 물품 전체 조회 (썸넬 추가 쿼리)
exports.findAll = async (userId) => {
  const [rows] = await pool.execute(
    `SELECT 
        i.*,
        
        SUBSTRING_INDEX(u.email, '@', 1) AS username,

        CASE 
          WHEN i.end_time < NOW() THEN 'CLOSED' 
          ELSE i.status 
        END AS status,
        
        (SELECT id FROM files f WHERE f.item_id = i.id LIMIT 1) AS thumbnail_id,
        (SELECT COUNT(*) FROM bids b WHERE b.item_id = i.id) AS bid_count,
        (SELECT COUNT(*) FROM likes l WHERE l.item_id = i.id) AS like_count,
        (SELECT COUNT(*) FROM likes l2 WHERE l2.item_id = i.id AND l2.user_id = ?) AS is_liked

     FROM items i
     JOIN users u ON i.user_id = u.user_id
     
     ORDER BY i.created_at DESC`,
    [userId || null],
  );
  return rows;
};

// 4. 물품 상세 조회
exports.findById = async (id, userId) => {
  const [rows] = await pool.execute(
    `SELECT 
        i.*,
        CASE 
          WHEN i.end_time < NOW() THEN 'CLOSED' 
          ELSE i.status 
        END AS status,
        
        (SELECT COUNT(*) FROM bids b WHERE b.item_id = i.id) AS bid_count,
        (SELECT COUNT(*) FROM likes l WHERE l.item_id = i.id) AS like_count,
        (SELECT COUNT(*) FROM likes l2 WHERE l2.item_id = i.id AND l2.user_id = ?) AS is_liked

     FROM items i
     WHERE id = ?`,
    [userId || null, id]
  );
  return rows[0];
};

// 5. 특정 물품의 이미지들 가져오기
exports.findImagesByItemId = async (itemId) => {
  const [rows] = await pool.execute(
    `SELECT id, file_path FROM files WHERE item_id = ?`,
    [itemId],
  );
  return rows;
};

// 6. 내가 등록한 물건 조회
exports.findByUserId = async (userId) => {
  const [rows] = await pool.execute(
    `SELECT 
        i.*, 
        CASE 
          WHEN i.end_time < NOW() THEN 'CLOSED' 
          ELSE i.status 
        END AS status,
        (SELECT id FROM files f WHERE f.item_id = i.id LIMIT 1) AS thumbnail_id,
        
        (SELECT COUNT(*) FROM bids b WHERE b.item_id = i.id) AS bid_count,
        (SELECT COUNT(*) FROM likes l WHERE l.item_id = i.id) AS like_count

     FROM items i
     WHERE i.user_id = ?
     ORDER BY i.created_at DESC`,
    [userId],
  );
  return rows;
};


// 7. 물품 수정
exports.updateItem = async (itemId, data) => {
  const { title, description, category, end_time, status } = data;
  
  await pool.execute(
    `UPDATE items 
     SET title = ?, description = ?, category = ?, end_time = ?, status = ?
     WHERE id = ?`,
    [title, description, category, end_time, status, itemId]
  );
};

// 8. 물품 삭제
exports.deleteItem = async (itemId) => {
  await pool.execute(
    'DELETE FROM items WHERE id = ?', 
    [itemId]
  );
};

// 9. 이미지 재등록
exports.updateItemImages = async (itemId, fileIds) => {
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();

    await connection.execute(
      `UPDATE files SET item_id = NULL WHERE item_id = ?`,
      [itemId]
    );

    if (fileIds && fileIds.length > 0) {
      const placeholders = fileIds.map(() => '?').join(',');
      await connection.execute(
        `UPDATE files SET item_id = ? WHERE id IN (${placeholders})`,
        [itemId, ...fileIds]
      );
    }

    await connection.commit();
  } catch (err) {
    await connection.rollback();
    throw err;
  } finally {
    connection.release();
  }
};