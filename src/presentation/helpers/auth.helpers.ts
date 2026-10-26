import {Response} from 'express';
import {ERROR_MESSAGES} from '@infrastructure/constants';

export const requireAuthUserId = (res: Response): number | undefined => {
    const {userId} = res.locals;
    if (typeof userId === 'number') return userId;

    res.status(401).json({
        success: false,
        error: {message: ERROR_MESSAGES.TOKEN.INVALID},
    });
    return undefined;
};
