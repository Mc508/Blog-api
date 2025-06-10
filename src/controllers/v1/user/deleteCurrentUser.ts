import { logger } from '@/lib/winston';
import { User } from '@/models/user';
import { Request, Response } from 'express';

export const deleteCurrentUser = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const userId = req.userId;

    await User.deleteOne({ _id: userId });

    res.sendStatus(204);
    logger.info('User deleted successfully');
  } catch (error) {
    res.status(500).json({
      code: 'ServerError',
      message: 'Internal server error',
      error: error,
    });
    logger.error('Error while deleting user', error);
  }
};
