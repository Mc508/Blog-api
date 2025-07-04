import config from '@/config';
import { refreshToken } from './refreshToken';
import { logger } from '@/lib/winston';
import { Token } from '@/models/token';
import { Request, Response } from 'express';

export const logout = async (req: Request, res: Response): Promise<void> => {
  try {
    const refreshToken = req.cookies.refreshToken as string;
    if (refreshToken) {
      await Token.deleteOne({ token: refreshToken });
      logger.info('User refresh token deleted successfully', {
        userId: req.userId,
        token: refreshToken,
      });
    }

    res.clearCookie('refreshToken', {
      httpOnly: true,
      secure: config.NODE_ENV === 'production',
      sameSite: 'strict',
    });

    res.sendStatus(204);

    logger.info('User logged out successfully', {
      userId: req.userId,
    });
  } catch (error) {
    res.status(500).json({
      code: 'ServerError',
      message: 'Internal Server Error',
      error: error,
    });
    logger.error('Error during logout', error);
  }
};
