const app = require('./app');
const dotenv = require('dotenv');

dotenv.config(); 

// 서버 port 설정
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Swagger Docs: http://localhost:${PORT}/api-docs`);
});