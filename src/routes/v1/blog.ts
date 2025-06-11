import { createBlog } from '@/controllers/v1/blog/createBlog';
import { getAllBlogs } from '@/controllers/v1/blog/getAllBlogs';
import { authenticate } from '@/middlewares/authenticate';
import authorize from '@/middlewares/authorize';
import { uploadBlogBanner } from '@/middlewares/uploadBlogBanner';
import validationError from '@/middlewares/validationError';
import { Router } from 'express';
import { body, query } from 'express-validator';
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

router.get(
  '/',
  authenticate,
  authorize(['admin','user']),
  query('limit')
    .optional()
    .isInt({ min: 1, max: 50 })
    .withMessage('Limit must be between 1 to 50'),
  query('offset')
    .optional()
    .isInt({ min: 0 })
    .withMessage('Offset must be greater then 0'),
  validationError,
  getAllBlogs,
);


export default router;
