import { Request, Response } from 'express';
import { JSDOM } from 'jsdom';
import DOMPurify from 'dompurify';
import { Blog, IBlog } from '@/models/blog';
import { logger } from '@/lib/winston';
import { User } from '@/models/user';
import { deleteBanner } from '@/lib/cloudinary';

export const deleteBlog = async (req: Request, res: Response) => {
  try {
    const userId = req.userId;
    const blogId = req.params.blogId;

    const user = await User.findById(userId).select('role').exec();

    const blog = await Blog.findById(blogId).select('-__v').exec();

    if (!blog) {
      res.status(404).json({
        code: 'NotFound',
        message: 'Blog not Found',
      });
      return;
    }

    if (blog?.author !== userId && user?.role !== 'admin') {
      res.status(403).json({
        code: 'AuthorizationError',
        message: 'Access denied',
      });
      logger.warn('A user tried to update blog without permission', {
        userId,
        blog,
      });
      return;
    }

    await deleteBanner(blog.banner.publicId);

    await Blog.deleteOne({_id: blogId });

    logger.info('Blog deleted');

    res.sendStatus(204);
  } catch (error) {
    res.status(500).json({
      code: 'ServerError',
      message: 'Internal server error',
      error: error,
    });
    logger.error('Error during deleting blog', error);
  }
};
