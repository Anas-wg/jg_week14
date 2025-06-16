import express from 'express';
import { signup, login } from './auth.controller.js';

const router = express.Router();

router.post('/signup', signup);
router.post('/login', login);

// 이 부분을 수정합니다.
// module.exports = router; (X)
export default router; // (O)