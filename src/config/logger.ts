import {envs} from '@config/envs';
import {PinoLoggerAdapter} from '@config/logger.adapter';

const isDevelopment = envs.NODE_ENV === 'development';

export const logger = new PinoLoggerAdapter({
    level: envs.LOG_LEVEL,
    transport: isDevelopment ? {target: 'pino-pretty'} : undefined,
    redact: [
        'password',
        '*.password',
        'token',
        '*.token',
        'authorization',
        '*.authorization',
    ],
});
