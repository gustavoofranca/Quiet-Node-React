import express from 'express';

import { createPost, getPosts, getPost, updatePost, deletePost } from '../controller/postController.js';

const router = express.Router();

router.post('/home', createPost);
router.get('/home', getPosts);
router.get('/home/:id', getPost);
router.put('/home/:id', updatePost);
router.delete('/home/:id', deletePost);

export default router;