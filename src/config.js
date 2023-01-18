//dotenv permite usar .env
const dotenv = require('dotenv');
dotenv.config();

module.exports = {
  port: process.env.PORT,
  db_token: process.env.DB_TOKEN,
};
