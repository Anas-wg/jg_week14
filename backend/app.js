// const express = require('express');
import express from 'express';
// const cors = require('cors');
import cors from 'cors';
// require('dotenv').config(); // .env 파일 로드
import 'dotenv/config';

// const db = require('./src/config/db'); // DB 설정 파일 불러오기
import db from './src/config/db.js'

// const authRouter = require('./src/api/auth/auth.routes');
import authRouter from './src/api/auth/auth.routes.js';
// const postsRouter = require('./src/api/posts/posts.routes');
import postsRouter from './src/api/posts/posts.routes.js';

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json()); // JSON 요청 본문 파싱
app.use(express.urlencoded({ extended: true })); // URL-encoded 요청 본문 파싱

// 라우터 연결
app.use('/api/auth', authRouter);
app.use('/api/posts', postsRouter);

app.get('/', (req, res) => {
  res.send('Board API Server is running!');
});

app.listen(PORT, () => {
  console.log(`✅ Backend server is running at http://localhost:${PORT}`);
});