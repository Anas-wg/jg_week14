import express from 'express';
import upload from '../../middlewares/upload.middleware.js';
import { uploadImage } from './uploads.controller.js';
import { verifyToken } from '../../middlewares/auth.middleware.js';

const router = express.Router();

// 미들웨어 실행 순서: 1. 토큰 검증 -> 2. 파일 업로드 -> 3. 컨트롤러 로직
router.post('/image', verifyToken, upload.single('image'), uploadImage);

export default router;