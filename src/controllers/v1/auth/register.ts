import type { Request, Response } from 'express';
import { logger } from '@/lib/winston';
import { IUser, User } from '@/models/user';
import { getUsername } from '@/utils';
import { generateAccessToken, generateRefreshToken } from '@/lib/jwt';
import config from '@/config';
import { Token } from '@/models/token';

type UserData = Pick<IUser, 'email' | 'password' | 'role'>;

export const register = async (req: Request, res: Response): Promise<void> => {
  const { email, password, role } = req.body as UserData;
  if(role === "admin" && !config.WHITELIST_ADMINS_MAIL.includes(email)){
      res.status(403).json({
        code:"Authorization Error",
        message:"You are not authorized to create admin account"
      })
      logger.warn("You are not authorized to create admin account")
    throw new Error('ADMIN_EMAIL is not defined');}
  try {
    const username = getUsername();

    const newUser = await User.create({
      username,
      email,
      password,
      role,
    });

    //generate access and refresh token
    const accessToken = generateAccessToken(newUser._id);
    const refreshToken = generateRefreshToken(newUser._id);

    //Store refresh token in db

    await Token.create({
      userId: newUser._id,
      token: refreshToken,
    });

    logger.info('refresh token created for user',{
        userId: newUser._id,
        token: refreshToken
    })

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: config.NODE_ENV === 'production',
      sameSite: 'strict',
    });

    res.status(201).json({
      user: {
        username: newUser.username,
        email: newUser.email,
        role: newUser.role,
      },
      accessToken,
    });

    logger.info('User created successfully',{
      username: newUser.username,
      email: newUser.email,
      role: newUser.role
    });
    
  } catch (error) {
    res.status(500).json({
      code: 'Server Error',
      message: 'Internal Server Error',
      error: error,
    });
    logger.error('Faild to create user', error);
  }
};
