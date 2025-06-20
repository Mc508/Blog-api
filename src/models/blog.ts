import { genSlug } from '@/utils';
import { Schema, Types, model } from 'mongoose';

export interface IBlog {
  title: string;
  slug: string;
  content: string;
  banner: {
    publicId: string;
    url: string;
    width: number;
    height: number;
  };
  author: Types.ObjectId;
  viewsCount: number;
  likesCount: number;
  commentsCount: number;
  status: 'draft' | 'published';
}

const blogSchema = new Schema<IBlog>(
  {
    title: {
      type: String,
      required: [true, 'Title is required'],
      maxlength: [180, 'Title must be 180 characters'],
    },
    slug: {
      type: String,
      required: [true, 'slug is required'],
      unique: [true, 'Slug must be unique'],
    },
    content: {
      type: String,
      required: [true, 'Content is required'],
    },
    banner: {
      publicId: {
        type: String,
        required: [true, 'Banner public id required'],
      },
      url: {
        type: String,
        required: [true, 'Banner url required'],
      },
      width: {
        type: Number,
        required: [true, 'Banner width required'],
      },
      height: {
        type: Number,
        required: [true, 'Banner height required'],
      },
    },
    author: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Author is required'],
    },
    viewsCount: {
      type: Number,
      default: 0,
    },
    likesCount: {
      type: Number,
      default: 0,
    },
    commentsCount: {
      type: Number,
      default: 0,
    },
    status: {
      type: String,
      enum: {
        values: ['draft', 'published'],
        message: '{value} is not supported',
      },
      default: 'draft',
    },
  },
  {
    timestamps: {
      createdAt: 'publishedAt',
    },
  },
);

blogSchema.pre('validate',function(next){
    if (this.title && !this.slug){
        this.slug = genSlug(this.title)
    }
    next()
})
export const Blog = model<IBlog>('Blog', blogSchema);
