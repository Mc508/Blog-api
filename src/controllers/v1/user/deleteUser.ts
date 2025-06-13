import { logger } from '@/lib/winston';
import { User } from '@/models/user';
import { Request, Response } from 'express';
import { v2 as cloudinary } from 'cloudinary';
import { Blog } from '@/models/blog';

export const deleteUser = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const userId = req.params.userId;

    const blogs = await Blog.find({ author: userId })
      .select('banner.publicId')
      .lean()
      .exec();
    const publicIds = blogs.map(({ banner }) => banner.publicId);
    await cloudinary.api.delete_resources(publicIds);

    logger.info('Multiple banners deleted from cloudinary', {
      publicIds,
    });

    await Blog.deleteMany({ author: userId });

    logger.info('All blogs deleted', {
      userId,
      blogs,
    });

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
