import {logger} from '@config/logger';
import {NextFunction, Request, Response} from 'express';

export const requestLogger = (req: Request, res: Response, next: NextFunction) => {
    const start: number = Date.now();

    res.on('finish', () => {
        const loggerContext = {
            method: req.method,
            url: req.originalUrl,
            statusCode: res.statusCode,
            durationMs: Date.now() - start,
        };
        if (res.statusCode >= 500) {
            logger.error('Request completed', loggerContext);
        } else if (res.statusCode >= 400) {
            logger.warn('Request completed', loggerContext);
        } else {
            logger.info('Request completed', loggerContext);
        }
    });

    next();
};
