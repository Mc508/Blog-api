import { time, timeStamp } from 'console';
import { Router } from 'express';
import authRoutes from './auth';
import userRoutes from './user';
import blogRoutes from './blog';
import likeRoutes from './like';
import commentRoutes from "./comment"

const router = Router();

router.get('/', (req, res) => {
  res.status(200).json({
    message: 'Hello World',
    version: '1.0.0',
    status: 'success',
    timeStamp: new Date().toISOString(),
  });
});

router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/blogs', blogRoutes);
router.use('/likes', likeRoutes);
router.use('/comments',commentRoutes)
export default router;
