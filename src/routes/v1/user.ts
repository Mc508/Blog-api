import { getCurrentUser } from '@/controllers/v1/user/getCurrentUser';
import { updateCurrentUser } from '@/controllers/v1/user/updateCurrentUser';
import { authenticate } from '@/middlewares/authenticate';
import authorize from '@/middlewares/authorize';
import validationError from '@/middlewares/validationError';
import { User } from '@/models/user';
import { Router } from 'express';
import { body } from 'express-validator';

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

export default router;
