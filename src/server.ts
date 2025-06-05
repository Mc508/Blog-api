import express from 'express';
import config from "@/config";
import cors from 'cors';
import type { CorsOptions } from 'cors';
import cookieParser from 'cookie-parser';
import helmet from 'helmet';
import compression from 'compression';
import limiter from '@/lib/expressRateLimit';
import v1Routes from '@/routes/v1';
import { connectToDatabase, disConnectFromDatabase } from '@/lib/mongoose';
import { logger } from '@/lib/winston';

const app = express();

const corsOption: CorsOptions = {
  origin(origin, callback) {
    if (
      config.NODE_ENV === 'development' ||
      !origin ||
      config.WHITELIST_ORIGINS.includes(origin)
    ) {
      callback(null, true);
    } else {
      callback(new Error(`${origin} Not allowed by CORS`), false);
      logger.warn(`${origin} Not allowed by CORS`);
    }
  },
};

app.use(cors(corsOption));

app.use(express.json());

app.use(express.urlencoded({ extended: true }));

app.use(cookieParser());

// Enabel compression to reduce payload size
app.use(
  compression({
    threshold: 1024, //Only compress files larger than 1kb
  }),
);

// Enabel security by setting various HTTP headers
app.use(helmet());

// Enabel rate limit to prevent excessive requests
app.use(limiter);

(async () => {
  try {
    await connectToDatabase()
    app.use('/api/v1', v1Routes);

    app.listen(config.PORT, () => {
      logger.info(`Server is running on http://localhost:${config.PORT}`);
    });
  } catch (error) {
    logger.error('Faild to start server', error);

    if (config.NODE_ENV === 'development') {
      process.exit(1);
    }
  }
})();

const handleServerShutdown = async()=>{
    try {
        await disConnectFromDatabase();
        logger.warn('Server is shutting down');
        process.exit(0);
    } catch (error) {
        logger.error("Faild to shutdown server", error);
    }
}

process.on('SIGTERM', handleServerShutdown);
process.on('SIGINT', handleServerShutdown);