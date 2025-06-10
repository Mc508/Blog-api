import dotenv from 'dotenv';
import type ms from 'ms';
dotenv.config();

const config = {
  PORT: process.env.PORT || 3000,
  NODE_ENV: process.env.NODE_ENV,
  WHITELIST_ORIGINS: ['http://localhost:3000'],
  DBNAME: process.env.DBNAME,
  MONGO_URI: process.env.MONGODB_URL,
  LOG_LEVEL: process.env.LOG_LEVEL,
  JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET!,
  JWT_ACCESS_SECRET: process.env.JWT_ACCESS_SECRET!,
  ACCESS_TOKEN_EXPIRY: process.env.ACCESS_TOKEN_EXPIRY as ms.StringValue,
  REFRESH_TOKEN_EXPIRY: process.env.REFRESH_TOKEN_EXPIRY as ms.StringValue,
  WHITELIST_ADMINS_MAIL:[
    "mihir@gmail.com"
  ]
};

export default config;
