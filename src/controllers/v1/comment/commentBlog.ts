import { Blog } from './../../../models/blog';
import DOMPurify from 'dompurify';
import { JSDOM } from 'jsdom';
import { Comment, IComment } from '@/models/comment';
import { Request, Response } from 'express';
import { logger } from '@/lib/winston';

type CommentData = Pick<IComment, 'content'>;

const window = new JSDOM('').window;
const purify = DOMPurify(window);

export const commentBlog = async (req: Request, res: Response) => {
  try {
    const userId = req.userId;
    const {blogId} = req.params;
    const { content } = req.body as CommentData;
    const blog = await Blog.findById(blogId).select('_id commentsCount').exec();
    if (!blog) {
      res.status(404).json({
        code: 'NotFound',
        message: 'Blog not found',
      });
      return;
    }
    const cleanContent = purify.sanitize(content);
    const newComment = await Comment.create({
      blogId,
      content: cleanContent,
      userId,
    });
    logger.info('New comment create', newComment);

    blog.commentsCount++;
    await blog.save();

    logger.info('Blog comments count update', {
      blogId: blog._id,
      commentCount: blog.commentsCount,
    });
    res.status(201).json({
      comment: newComment,
    });
  } catch (error) {
    res.status(500).json({
      code: 'ServerError',
      message: 'Internal server error',
      error: error,
    });
    logger.error('Error during commenting blog', error);
  }
};
