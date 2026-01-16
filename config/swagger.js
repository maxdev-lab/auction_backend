const swaggerAutogen = require('swagger-autogen')();

const doc = {
  info: {
    title: 'Auction Market API',
    description: '경매 프로젝트 API 명세서',
  },
  host: 'localhost:3000',
  schemes: ['http'],
};

const outputFile = '../swagger-output.json'; 
const endpointsFiles = [
  '../app.js'
];   

swaggerAutogen(outputFile, endpointsFiles, doc);