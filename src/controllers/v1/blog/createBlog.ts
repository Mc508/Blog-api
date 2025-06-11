import { Request, Response } from 'express';
import { JSDOM } from 'jsdom';
import DOMPurify from 'dompurify';
import { Blog, IBlog } from '@/models/blog';
import { logger } from '@/lib/winston';

type BlogData = Pick<IBlog, 'title' | 'content' | 'banner' | 'status'>;

const window = new JSDOM('').window;
const purify = DOMPurify(window);

export const createBlog = async (req: Request, res: Response) => {
  try {
    const {title,content,banner,status}=req.body
    const userId = req.userId;
    const cleanContent = purify.sanitize(content);
    const newBlog = await Blog.create({
        title,content:cleanContent,
        banner,
        status,
        author:userId
    })

    logger.info("New Blog created ",newBlog)
    res.status(201).json({
        blog:newBlog
    })
  } catch (error) {
    res.status(500).json({
      code: 'ServerError',
      message: 'Internnal server error',
      error: error,
    });
    logger.error('Error during blog creation', error);
  }
};
