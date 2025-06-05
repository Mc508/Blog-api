import { rateLimit } from 'express-rate-limit';

const limiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minutes
  max: 60, // Limit each IP to 60 requests per `window` (here, per 1 minutes)
  standardHeaders: 'draft-8', // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  message: {
    error: 'You have exceeded the limit of 60 request per minute',
  },
});

export default limiter;
