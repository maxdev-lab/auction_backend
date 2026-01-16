const bcrypt = require('bcrypt');
const User = require('../models/userModel');
const transporter = require('../config/email');

const authController = {
    // 1. 인증번호 이메일 발송
    sendVerificationCode: async (req, res) => {
        try {
            const { email } = req.body;

            // 1-1. 학교 이메일 체크
            if (!email.endsWith('@tukorea.ac.kr')) {
                return res.status(400).json({ message: '학교 이메일(@tukorea.ac.kr)만 사용 가능합니다.' });
            }

            // 1-2. 이미 가입된 이메일인지 체크
            const existingUser = await User.findByEmail(email);
            if (existingUser) {
                return res.status(409).json({ message: '이미 가입된 이메일입니다.' });
            }

            // 1-3. 인증번호 생성 (6자리 난수)
            const code = Math.floor(100000 + Math.random() * 900000).toString();

            // 1-4. DB에 인증번호 저장
            await User.saveVerificationCode(email, code);

            // 1-5. 이메일 발송
            const mailOptions = {
                from: process.env.MAIL_USER,
                to: email,
                subject: '[Auction] 회원가입 인증번호입니다.',
                text: `인증번호는 [${code}] 입니다. 3분 안에 입력해주세요.`
            };

            await transporter.sendMail(mailOptions);

            res.status(200).json({ message: '인증번호가 발송되었습니다.' });

        } catch (error) {
            console.error(error);
            res.status(500).json({ message: '이메일 전송 실패', error: error.message });
        }
    },

    // 2. 인증번호 검증
    verifyCode: async (req, res) => {
        try {
            const { email, code } = req.body;

            // 2-1. 유효한 인증번호인지 DB 조회
            const verification = await User.findVerification(email, code);

            if (!verification) {
                return res.status(400).json({ message: '잘못된 인증번호거나 유효기간이 만료되었습니다.' });
            }

            // 2-2. 인증 완료 상태로 변경 (is_verified = true)
            await User.markEmailAsVerified(verification.id);

            res.status(200).json({ message: '이메일 인증이 완료되었습니다.' });

        } catch (error) {
            console.error(error);
            res.status(500).json({ message: '서버 오류' });
        }
    },

    // 3. 최종 회원가입
    signup: async (req, res) => {
        try {
            const { email, password } = req.body;

            // ★ [추가된 보안 로직] 이메일 인증 여부 체크
            // DB에 'is_verified = 1' 인 기록이 없으면 가입 거부
            const isVerified = await User.checkVerified(email);
            if (!isVerified) {
                return res.status(401).json({ message: '이메일 인증이 완료되지 않았습니다.' });
            }

            // 3-1. 이미 가입된 이메일인지 체크
            const existingUser = await User.findByEmail(email);
            if (existingUser) {
                return res.status(409).json({ message: '이미 가입된 이메일입니다.' });
            }

            // 3-2. 비밀번호 암호화
            const saltRounds = 10;
            const hashedPassword = await bcrypt.hash(password, saltRounds);

            // 3-3. DB에 유저 저장
            await User.createUser(email, hashedPassword);

            res.status(201).json({ message: '회원가입 성공!' });

        } catch (error) {
            console.error(error);
            res.status(500).json({ message: '회원가입 실패' });
        }
    }
};

module.exports = authController;