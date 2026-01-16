const app = require('./app');
const dotenv = require('dotenv');

// app.js에서도 로드하지만, 여기서 PORT를 쓰려면 한 번 더 명시하는 게 안전합니다.
dotenv.config(); 

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Swagger Docs: http://localhost:${PORT}/api-docs`);
});