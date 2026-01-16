const pool = require('../config/db');

// 1. 이메일로 회원 찾기
exports.findByEmail = async (email) => {
    const [rows] = await pool.execute(
        'SELECT * FROM users WHERE email = ?',
        [email]
    );
    return rows[0];
};

// 2. 회원가입
exports.createUser = async (email, password) => {
    const [result] = await pool.execute(
        'INSERT INTO users (email, password) VALUES (?, ?)',
        [email, password]
    );
    return result;
};

// 3. 이메일 인증 여부 확인
exports.checkVerified = async (email) => {
    const [rows] = await pool.execute(
        'SELECT * FROM email_verifications WHERE email = ? AND is_verified = TRUE',
        [email]
    );
    return rows.length > 0;
};

// 4. 인증번호 저장 
exports.saveVerificationCode = async (email, code) => {
    // 만료 시간은 현재 시간 + 3분
    const expiresAt = new Date(Date.now() + 3 * 60 * 1000);

    const [result] = await pool.execute(
        'INSERT INTO email_verifications (email, code, expires_at) VALUES (?, ?, ?)',
        [email, code, expiresAt]
    );
    return result;
};

// 5. 유효한 인증번호 가져오기 
exports.findVerification = async (email, code) => {
    const [rows] = await pool.execute(
        `SELECT * FROM email_verifications 
         WHERE email = ? 
         AND code = ? 
         AND is_verified = FALSE 
         AND expires_at > NOW() 
         ORDER BY created_at DESC LIMIT 1`,
        [email, code]
    );
    return rows[0];
};

// 6. 인증 완료 처리 (상태 변경)
exports.markEmailAsVerified = async (id) => {
    await pool.execute(
        'UPDATE email_verifications SET is_verified = TRUE WHERE id = ?',
        [id]
    );
};

// 7. ID로 유저 정보 조회 (user_id)
exports.findById = async (id) => {
    const [rows] = await pool.execute(
        'SELECT user_id, email, created_at FROM users WHERE user_id = ?',
        [id]
    );
    return rows[0];
};