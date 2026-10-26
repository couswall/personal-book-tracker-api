import {Request, Response} from 'express';
import {CustomError} from '@domain/errors/custom.error';
import {BookshelfRepository} from '@domain/repositories/bookshelf.repository';
import {ReadingChallengeRepository} from '@domain/repositories/readingChallenge.repository';
import {ReadingSessionRepository} from '@domain/repositories/readingSession.repository';
import {GetDashboard} from '@domain/use-cases';
import {requireAuthUserId} from '@presentation/helpers';

export class DashboardController {
    constructor(
        private readonly bookshelfRepository: BookshelfRepository,
        private readonly readingChallengeRepository: ReadingChallengeRepository,
        private readonly readingSessionRepository: ReadingSessionRepository
    ) {}

    public getDashboard = (_req: Request, res: Response) => {
        const userId = requireAuthUserId(res);
        if (!userId) return;

        new GetDashboard(
            this.bookshelfRepository,
            this.readingChallengeRepository,
            this.readingSessionRepository
        )
            .execute(userId)
            .then((dashboard) =>
                res.status(200).json({
                    success: true,
                    message: 'Dashboard fetched successfully',
                    data: {dashboard},
                })
            )
            .catch((error) => CustomError.handleError(error, res));
    };
}
