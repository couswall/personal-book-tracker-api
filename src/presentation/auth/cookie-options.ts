import {CookieOptions} from 'express';
import {envs} from '@config/envs';

export const REFRESH_COOKIE_NAME = 'refreshToken';

export const refreshCookieOptions: CookieOptions = {
    httpOnly: true,
    secure: envs.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    path: '/api/auth',
};
