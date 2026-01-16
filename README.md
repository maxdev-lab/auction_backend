# 🛒 Auction Backend Project

이 프로젝트는 경매 플랫폼의 백엔드 서버입니다. Node.js와 Express를 기반으로 구축되었으며, MySQL 데이터베이스를 사용합니다.

## 🛠 Tech Stack

* **Runtime:** Node.js
* **Framework:** Express.js
* **Database:** MySQL (mysql2)
* **Documentation:** Swagger (swagger-autogen, swagger-ui-express)
* **Security:** bcrypt , cors
* **Utils:** Nodemailer, Dotenv, Nodemon

## ⚙️ Environment Setup (환경 설정)

.env는 노션에 올림

## 🚀 Execution (실행 방법)

### 1. Swagger 문서 생성 (필수)
API 코드가 변경되었거나 처음 실행할 때, 최신 명세서를 생성하기 위해 아래 명령어를 실행하세요.

```bash
node config/swagger.js
```

서버 실행
```bash
npm run dev
```

API Documentation (Swagger) : http://localhost:3000/api-docs
