const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const swaggerUi = require('swagger-ui-express');
const swaggerFile = require('./swagger-output.json'); 
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/user');
const fileRoutes = require('./routes/file');
const itemRoutes = require('./routes/item');

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

// Swagger 연결
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerFile));

// 인증 api
app.use('/api/auth', authRoutes);
// 유저 api
app.use('/api/users', userRoutes);
// 업로드 api
app.use('/api/files', fileRoutes);
// 물품 api
app.use('/api/items', itemRoutes);

app.get('/', (req, res) => {
    res.send('Auction Backend is running!');
});

module.exports = app;