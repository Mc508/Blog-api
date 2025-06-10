import { logger } from '@/lib/winston';
import { User } from '@/models/user';
import { Request, Response } from 'express';

export const deleteUser = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const userId = req.params.userId;
    await User.deleteOne({ _id: userId });
    logger.info('User account deleted successfully');
    res.sendStatus(204);
  } catch (error) {
    res.status(500).json({
      code: 'ServerError',
      message: 'Internal server error',
      error: error,
    });
    logger.error('Error while deleting user', error);
  }
};
