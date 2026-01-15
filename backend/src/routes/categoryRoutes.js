import express from 'express';
import { authMiddleware } from '../middleware/auth.js';
import {
  getCategories,
  createCategory,
  deleteCategory
} from '../controllers/categoryController.js';

const router = express.Router();

router.use(authMiddleware);

router.get('/', getCategories);
router.post('/', createCategory);
router.delete('/:id', deleteCategory);

export default router;
