import { error } from 'console';
import { verifyAccessToken } from '@/lib/jwt';
import { verify } from 'crypto';
import { NextFunction, Request, Response } from 'express';
import { JsonWebTokenError, TokenExpiredError } from 'jsonwebtoken';
import { Types } from 'mongoose';
import { logger } from '@/lib/winston';

export const authenticate = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith('Bearer ')) {
    res
      .status(401)
      .json({
        code: 'AuthenticationError',
        message: 'Access denied, no token provided',
      })
      return 
  }
  const [_,token] = authHeader.split(' ');

  try {
    const jwtPayload = verifyAccessToken(token) as {userId:Types.ObjectId}

    req.userId = jwtPayload.userId

    return next();

  } catch (error) {
    if (error instanceof TokenExpiredError){
        res.status(401).json({
            code:"AuthenticationError",
            message:"Access token expired, request a new one with refresh token"
        });
        return 
    }

    // handle invvalid token error
    if(error instanceof JsonWebTokenError){
        res.status(401).json({
            code:"AuthenticationError",
            message:"Access token invalid"
        });
        return;
    }

    // catch-all for other errors
    res.status(500).json({
        code:"ServerError",
        message:"Internal server error",
        error:error
    });
    logger.error("Error during authentication",error)
  }
};

