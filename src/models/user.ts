import bcrypt from 'bcrypt';
import { Schema, model } from 'mongoose';

export interface IUser {
  username: string;
  email: string;
  password: string;
  role: 'admin' | 'user';
  firstName?: string;
  lastName?: string;
  socialLinks?: {
    website?: string;
    facebook?: string;
    youtube?: string;
    instagram?: string;
    x?: string;
    github?: string;
  };
}

const userSchema = new Schema<IUser>(
  {
    username: {
      type: String,
      required: [true, 'Username is required'],
      unique: [true, 'Username must be unique'],
      maxlength: [20, 'Username must be less than 20 characters'],
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: [true, 'Email must be unique'],
      maxlength: [50, 'Email must be less than 50 characters'],
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      select: false,
    },
    role: {
      type: String,
      require: [true, 'Role is required'],
      enum: ['admin', 'user'],
      default: 'user',
    },
    firstName: {
      type: String,
      maxlength: [20, 'First name must be less than 20 characters'],
    },
    lastName: {
      type: String,
      maxlength: [20, 'Last name must be less than 20 characters'],
    },
    socialLinks: {
      website: {
        type: String,
        maxLength: [100, 'url must be less than 100 characters'],
      },
      facebook: {
        type: String,
        maxLength: [100, 'url must be less than 100 characters'],
      },
      youtube: {
        type: String,
        maxLength: [100, 'url must be less than 100 characters'],
      },
      instagram: {
        type: String,
        maxLength: [100, 'url must be less than 100 characters'],
      },
      x: {
        type: String,
        maxLength: [100, 'url must be less than  100 characters'],
      },
      github: {
        type: String,
        maxLength: [100, 'url must be less than 100 characters'],
      },
    },
  },
  {
    timestamps: true,
  },
);


userSchema.pre('save',async function(next){
  if(!this.isModified('password')) return next()

  this.password = await bcrypt.hash(this.password, 10)
})

export const User = model<IUser>('User', userSchema);
