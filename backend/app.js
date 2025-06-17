import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import path from 'path';
import { fileURLToPath } from 'url';


import db from './src/config/db.js'

import authRouter from './src/api/auth/auth.routes.js';
import postsRouter from './src/api/posts/posts.routes.js';
import uploadsRouter from './src/api/uploads/uploads.routes.js';


const app = express();
const PORT = 3000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(cors());
app.use(express.json()); // JSON 요청 본문 파싱
app.use(express.urlencoded({ extended: true })); // URL-encoded 요청 본문 파싱

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));


// 라우터 연결
app.use('/api/auth', authRouter);
app.use('/api/posts', postsRouter);
app.use('/api/uploads', uploadsRouter);


app.get('/', (req, res) => {
  res.send('Board API Server is running!');
});

app.listen(PORT, () => {
  console.log(`✅ Backend server is running at http://localhost:${PORT}`);
});