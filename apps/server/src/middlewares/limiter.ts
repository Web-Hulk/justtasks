import rateLimit from "express-rate-limit";

export const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 100,
    message: {
        status: 429,
        error: 'TooManyRequests',
        message: 'Too many requests from this IP, please try again later.'
    }
})