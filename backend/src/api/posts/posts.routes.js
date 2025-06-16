import express from 'express';
import { getPosts, createPost, getPostById, createComment } from './posts.controller.js';
import { verifyToken } from '../../middlewares/auth.middleware.js';

const router = express.Router();

router.get('/', getPosts);
router.post('/', verifyToken, createPost);
router.get('/:postId', getPostById);
router.post('/:postId/comments', verifyToken, createComment);


// 이 부분을 수정합니다.
// module.exports = router; (X)
export default router; // (O)