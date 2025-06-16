import mysql from 'mysql2/promise';
import 'dotenv/config';

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  charset: 'utf8mb4', // 한글 깨짐 이슈
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

console.log('✅ MySQL Connection Pool is created.');

// 이 부분을 수정합니다.
// module.exports = pool; (X)
export default pool; // (O)