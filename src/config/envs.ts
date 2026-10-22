import 'dotenv/config';
import {get} from 'env-var';

export const envs = {
    PORT: get('PORT').required().asPortNumber(),
    PUBLIC_PATH: get('PUBLIC_PATH').required().asString(),
    JWT_SEED: get('JWT_SEED').required().asString(),
    BOOKS_API: get('BOOKS_API').required().asString(),
    GOOGLE_BOOKS_API_KEY: get('GOOGLE_BOOKS_API_KEY').required().asString(),
    LOG_LEVEL: get('LOG_LEVEL')
        .default('info')
        .asEnum(['fatal', 'error', 'warn', 'info', 'debug', 'trace', 'silent']),
    NODE_ENV: get('NODE_ENV')
        .default('development')
        .asEnum(['development', 'production', 'test']),
};
