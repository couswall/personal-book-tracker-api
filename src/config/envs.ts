import 'dotenv/config';
import {get} from 'env-var';

export const envs = {
    PORT: get('PORT').required().asPortNumber(),
    PUBLIC_PATH: get('PUBLIC_PATH').required().asString(),
    JWT_SEED: get('JWT_SEED').required().asString(),
    BOOKS_API: get('BOOKS_API').required().asString(),
};