const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const swaggerUi = require('swagger-ui-express');
const swaggerFile = require('./swagger-output.json'); 
const authRoutes = require('./routes/auth');

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

// Swagger 연결
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerFile));

// 인증 api
app.use('/api/auth', authRoutes);

app.get('/', (req, res) => {
    res.send('Auction Backend is running!');
});

module.exports = app;