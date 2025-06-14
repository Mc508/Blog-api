import { Blog } from '../../../models/blog';
import { Comment } from '@/models/comment';
import { Request, Response } from 'express';
import { logger } from '@/lib/winston';
import { User } from '@/models/user';

export const deleteComment = async (req: Request, res: Response) => {
  try {
    const userId = req.userId;
    const { commentId } = req.params;

    const comment = await Comment.findById(commentId)
      .select('userId blogId')
      .lean()
      .exec();

    const user = await User.findById(userId).select('role').lean().exec();

    if (!comment) {
      res.status(404).json({
        code: 'NotFound',
        message: 'Comment not found',
      });
      return;
    }

    const blog = await Blog.findById(comment.blogId)
      .select('commentsCount')
      .exec();

    if (!blog) {
      res.status(404).json({
        code: 'NotFound',
        message: 'Blog not found',
      });
      return;
    }

    if (comment.userId === userId && user?.role !== 'admin') {
      res.status(403).json({
        code: 'AuthorizationError',
        message: 'Access denied insufficient permission',
      });
      logger.warn('A user tried to delete a comment without permission', {
        userId,
        comment,
      });
      return;
    }
    await Comment.deleteOne({ _id: commentId });
    logger.info('COmment deleted', commentId);

    blog.commentsCount--;

    logger.info('Blog comments count info updated', {
      blogId: blog._id,
      commentsCount: blog.commentsCount,
    });

    res.sendStatus(204);
  } catch (error) {
    res.status(500).json({
      code: 'ServerError',
      message: 'Internal server error',
      error: error,
    });
    logger.error('Error during retriving comment', error);
  }
};
