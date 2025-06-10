import { deleteCurrentUser } from '@/controllers/v1/user/deleteCurrentUser';
import { getAllUser } from '@/controllers/v1/user/getAllUser';
import { getCurrentUser } from '@/controllers/v1/user/getCurrentUser';
import { getUser } from '@/controllers/v1/user/getUser';
import { updateCurrentUser } from '@/controllers/v1/user/updateCurrentUser';
import { authenticate } from '@/middlewares/authenticate';
import authorize from '@/middlewares/authorize';
import validationError from '@/middlewares/validationError';
import { User } from '@/models/user';
import { Router } from 'express';
import { body, param, query } from 'express-validator';

const router = Router();

router.get(
  '/current',
  authenticate,
  authorize(['admin', 'user']),
  getCurrentUser,
);

router.put(
  '/current',
  authenticate,
  authorize(['admin', 'user']),
  body('username')
    .optional()
    .trim()
    .isLength({ max: 20 })
    .withMessage('Username must be less then 20 characters')
    .custom(async (value) => {
      const userExist = await User.exists({ username: value });
      if (userExist) {
        throw Error('THis username is already in use');
      }
    }),
  body('email')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('Email is required')
    .isEmail()
    .withMessage('Email is invalid')
    .custom(async (value) => {
      const userExists = await User.exists({ email: value });
      if (userExists) {
        throw new Error('User email or password is invalid');
      }
    }),
  body('password')
    .optional()
    .notEmpty()
    .withMessage('Password is required')
    .isLength({ min: 8 })
    .withMessage('Password must be atleast 8 character long'),
  body('firstName')
    .optional()
    .isLength({ max: 20 })
    .withMessage('Firstname must be less then 20 characters'),
  body('lastName')
    .optional()
    .isLength({ max: 20 })
    .withMessage('Firstname must be less then 20 characters'),
  body([
    'website',
    'facebook',
    'instagram',
    'x',
    'youtube',
    'linkedin',
    'github',
  ])
    .optional()
    .isURL()
    .withMessage('Invalid URL')
    .isLength({ max: 100 })
    .withMessage('URL must be less then 100 characters'),
  validationError,
  updateCurrentUser,
);

router.delete(
  '/current',
  authenticate,
  authorize(['admin', 'user']),
  deleteCurrentUser,
);

router.get(
  '/all',
  authenticate,
  authorize(['admin']),
  query('limit')
    .optional()
    .isInt({ min: 1, max: 50 })
    .withMessage('Limit must be between 1 to 50'),
  query('offset')
    .optional()
    .isInt({ min: 0 })
    .withMessage('Offset must be greater then 0'),
  validationError,
  getAllUser,
);

router.get(
  '/:userId',
  authenticate,
  authorize(['admin']),
  param('userId').notEmpty().isMongoId().withMessage('Invalid User Id'),
  validationError,
  getUser,
);

export default router;
