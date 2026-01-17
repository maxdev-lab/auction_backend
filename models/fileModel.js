const pool = require('../config/db');

// 파일 생성

exports.createFile = async (data) => {
  const { originalName, storedName, filePath, size } = data;
  
  const [result] = await pool.execute(
    'INSERT INTO files (original_name, stored_name, file_path, size) VALUES (?, ?, ?, ?)',
    [originalName, storedName, filePath, size]
  );
  return result.insertId;
};

// ID로 파일 조회
exports.findById = async (id) => {
  const [rows] = await pool.execute(
    'SELECT * FROM files WHERE id = ?',
    [id]
  );
  return rows[0];
};

// 파일 삭제
exports.delete = async (id) => {
  await pool.execute('DELETE FROM files WHERE id = ?', [id]);
};