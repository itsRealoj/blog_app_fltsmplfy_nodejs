import express from 'express'
const router = express.Router()
import {
  getPosts,
  getPostById,
  deletePost,
  createPost,
  updatePost,
  likePost,
} from '../controllers/postController.js'
import { protect, admin } from '../middleware/authMiddleware.js'

router.route('/').get(getPosts).post(protect, admin, createPost)
router.route('/:id/like').post(protect, likePost)
router
  .route('/:id')
  .get(protect, getPostById)
  .delete(protect, admin, deletePost)
  .put(protect, admin, updatePost)

export default router