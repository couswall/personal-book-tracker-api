import {StringValue} from 'ms';

export const REFRESH_TOKEN_DAYS = 7;

export const REFRESH_TOKEN_DURATION: StringValue = `${REFRESH_TOKEN_DAYS}d`;

export const REFRESH_TOKEN_MAX_AGE_MS = REFRESH_TOKEN_DAYS * 24 * 60 * 60 * 1000;
