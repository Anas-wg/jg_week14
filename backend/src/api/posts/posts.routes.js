import express from 'express';
import { getPosts, createPost, getPostById, createComment, getLatestPosts, updatePost, deletePost } from './posts.controller.js';
import { verifyToken } from '../../middlewares/auth.middleware.js';

const router = express.Router();

// GET /api/posts/latest
router.get('/latest', getLatestPosts);


router.get('/', getPosts);
router.post('/', verifyToken, createPost);
router.get('/:postId', getPostById);
router.post('/:postId/comments', verifyToken, createComment);


router.put('/:id', verifyToken, updatePost); // 게시물 수정 (PUT)
router.delete('/:id', verifyToken, deletePost); // 게시물 삭제 (DELETE)



export default router; 