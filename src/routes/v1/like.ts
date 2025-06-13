import { likeBlog } from '@/controllers/v1/like/likeBlog';
import { authenticate } from '@/middlewares/authenticate';
import authorize from '@/middlewares/authorize';
import { Router } from 'express';
import { param } from 'express-validator';

const router = Router();

router.post(
  '/blog/:blogId',
  authenticate,
  authorize(['admin', 'user']),
  param('blogId').isMongoId().withMessage('Invalid blog ID'),
  likeBlog,
);

export default router;
