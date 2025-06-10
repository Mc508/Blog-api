import { time, timeStamp } from 'console';
import { Router } from 'express';
import authRoutes from './auth';
import userRoutes from "./user";

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
router.use('/users',userRoutes)
  
export default router