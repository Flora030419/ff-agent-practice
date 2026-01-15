import express from 'express';
import { authMiddleware } from '../middleware/auth.js';
import {
  getSummary,
  getByCategory,
  getByDate
} from '../controllers/statisticsController.js';

const router = express.Router();

router.use(authMiddleware);

router.get('/summary', getSummary);
router.get('/by-category', getByCategory);
router.get('/by-date', getByDate);

export default router;
