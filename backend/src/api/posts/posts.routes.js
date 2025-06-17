import express from 'express';
import { getPosts, createPost, getPostById, createComment, getLatestPosts } from './posts.controller.js';
import { verifyToken } from '../../middlewares/auth.middleware.js';

const router = express.Router();

// GET /api/posts/latest
router.get('/latest', getLatestPosts);


router.get('/', getPosts);
router.post('/', verifyToken, createPost);
router.get('/:postId', getPostById);
router.post('/:postId/comments', verifyToken, createComment);


export default router; 