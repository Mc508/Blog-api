import { createBlog } from '@/controllers/v1/blog/createBlog';
import { authenticate } from '@/middlewares/authenticate';
import authorize from '@/middlewares/authorize';
import { uploadBlogBanner } from '@/middlewares/uploadBlogBanner';
import validationError from '@/middlewares/validationError';
import { Router } from 'express';
import { body } from 'express-validator';
import multer from 'multer';

const upload = multer();
const router = Router();
router.post(
  '/',
  authenticate,
  authorize(['admin']),
  upload.single('bannerImage'),
  body('title')
    .trim()
    .notEmpty()
    .withMessage('Title is required')
    .isLength({ max: 180 })
    .withMessage('Title must be less then 180 characters'),
  body('content').trim().notEmpty().withMessage('Title is required'),
  body('status')
    .optional()
    .isIn(['draft', 'published'])
    .withMessage('Status must be one of the value, draft or published'),
  validationError,
  uploadBlogBanner('post'),
  createBlog,
);

export default router;
