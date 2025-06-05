import mongoose from 'mongoose';
import config from '../config';
import type { ConnectOptions } from 'mongoose';
import { logger } from './winston';

const clientOptions: ConnectOptions = {
  dbName: config.DBNAME,
  appName: 'blog-api',
  serverApi: {
    version: '1',
    strict: true,
    deprecationErrors: true,
  },
};

export const connectToDatabase = async (): Promise<void> => {
  if (!config.MONGO_URI) throw new Error('MONGO_URI is not defined');
  try {
    await mongoose.connect(config.MONGO_URI, clientOptions);
    logger.info('Connected to database');
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message);
    }
    logger.error('Faild to connect to database', error);
  }
};

export const disConnectFromDatabase = async (): Promise<void> => {
  try {
    await mongoose.disconnect();
    logger.info('Disconnected from database');
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message);
    }
    logger.error('Faild to disconnect from database', error);
  }
};
