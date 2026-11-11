import {CookieOptions} from 'express';
import {envs} from '@config/envs';
import {REFRESH_TOKEN_MAX_AGE_MS} from '@config/token-lifetimes';

export const REFRESH_COOKIE_NAME = 'refreshToken';

export const refreshCookieOptions: CookieOptions = {
    httpOnly: true,
    secure: envs.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: REFRESH_TOKEN_MAX_AGE_MS,
    path: '/api/auth',
};
