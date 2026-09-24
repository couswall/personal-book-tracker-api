import {Response} from 'express';
import {ReadingChallengeEntity} from '@domain/entities';

export const sendBadRequest = (res: Response, message?: string): void => {
    res.status(400).json({success: false, error: {message}});
};

export const toResponse = ({userId: _userId, ...challenge}: ReadingChallengeEntity) =>
    challenge;
