import { Blog } from '../../../models/blog';
import { Comment } from '@/models/comment';
import { Request, Response } from 'express';
import { logger } from '@/lib/winston';

export const getCommentByBlog = async (req: Request, res: Response) => {
  try {
    const { blogId } = req.params;
    const blog = await Blog.findById(blogId).select('_id commentsCount').exec();

    if (!blog) {
      res.status(404).json({
        code: 'NotFound',
        message: 'Blog not found',
      });
      return;
    }

    const allComments = await Comment.find({ blogId })
      .sort({ createdAt: -1 })
      .lean()
      .exec();

    res.status(201).json({
      comment: allComments,
    });
  } catch (error) {
    res.status(500).json({
      code: 'ServerError',
      message: 'Internal server error',
      error: error,
    });
    logger.error('Error during retriving comment', error);
  }
};
