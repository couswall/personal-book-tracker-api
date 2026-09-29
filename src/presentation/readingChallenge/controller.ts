import {Request, Response} from 'express';
import {CustomError} from '@domain/errors/custom.error';
import {
    CreateReadingChallengeDto,
    ReadingChallengeYearDto,
    UpdateReadingChallengeDto,
} from '@domain/dtos';
import {ReadingChallengeRepository} from '@domain/repositories/readingChallenge.repository';
import {ReadingSessionRepository} from '@domain/repositories/readingSession.repository';
import {
    CreateReadingChallenge,
    DeleteReadingChallenge,
    GetReadingChallengeHistory,
    GetReadingChallengeProgress,
    UpdateReadingChallenge,
} from '@domain/use-cases';
import {requireAuthUserId, sendBadRequest, toResponse} from '@presentation/helpers';

export class ReadingChallengeController {
    constructor(
        private readonly repository: ReadingChallengeRepository,
        private readonly readingSessionRepository: ReadingSessionRepository
    ) {}

    public createReadingChallenge = (req: Request, res: Response) => {
        const userId = requireAuthUserId(res);
        if (!userId) return;

        const [errorMsg, dto] = CreateReadingChallengeDto.create(req.body);
        if (errorMsg || !dto) {
            sendBadRequest(res, errorMsg);
            return;
        }

        new CreateReadingChallenge(this.repository)
            .execute(dto, userId)
            .then((readingChallenge) =>
                res.status(201).json({
                    success: true,
                    message: 'Reading challenge created successfully',
                    data: {readingChallenge: toResponse(readingChallenge)},
                })
            )
            .catch((error) => CustomError.handleError(error, res));
    };

    public updateReadingChallenge = (req: Request, res: Response) => {
        const userId = requireAuthUserId(res);
        if (!userId) return;

        const [errorMsg, dto] = UpdateReadingChallengeDto.create({
            year: req.params.year,
            goal: req.body?.goal,
        });
        if (errorMsg || !dto) {
            sendBadRequest(res, errorMsg);
            return;
        }

        new UpdateReadingChallenge(this.repository)
            .execute(dto, userId)
            .then((readingChallenge) =>
                res.status(200).json({
                    success: true,
                    message: 'Reading challenge updated successfully',
                    data: {readingChallenge: toResponse(readingChallenge)},
                })
            )
            .catch((error) => CustomError.handleError(error, res));
    };

    public deleteReadingChallenge = (req: Request, res: Response) => {
        const userId = requireAuthUserId(res);
        if (!userId) return;

        const [errorMsg, dto] = ReadingChallengeYearDto.create({year: req.params.year});
        if (errorMsg || !dto) {
            sendBadRequest(res, errorMsg);
            return;
        }

        new DeleteReadingChallenge(this.repository)
            .execute(dto, userId)
            .then(() =>
                res.status(200).json({
                    success: true,
                    message: 'Reading challenge deleted successfully',
                })
            )
            .catch((error) => CustomError.handleError(error, res));
    };

    public getReadingChallengeProgress = (req: Request, res: Response) => {
        this.sendProgress(res, req.params.year);
    };

    public getCurrentReadingChallengeProgress = (_req: Request, res: Response) => {
        this.sendProgress(res, new Date().getUTCFullYear());
    };

    public getReadingChallengeHistory = (_req: Request, res: Response) => {
        const userId = requireAuthUserId(res);
        if (!userId) return;

        new GetReadingChallengeHistory(this.repository, this.readingSessionRepository)
            .execute(userId)
            .then((readingChallenges) =>
                res.status(200).json({
                    success: true,
                    message: 'Reading challenge history fetched successfully',
                    data: {readingChallenges},
                })
            )
            .catch((error) => CustomError.handleError(error, res));
    };

    private sendProgress(res: Response, year?: number | string): void {
        const userId = requireAuthUserId(res);
        if (!userId) return;

        const [errorMsg, dto] = ReadingChallengeYearDto.create({year});
        if (errorMsg || !dto) {
            sendBadRequest(res, errorMsg);
            return;
        }

        new GetReadingChallengeProgress(this.repository, this.readingSessionRepository)
            .execute(dto, userId)
            .then((readingChallenge) =>
                res.status(200).json({
                    success: true,
                    message: 'Reading challenge progress fetched successfully',
                    data: {readingChallenge},
                })
            )
            .catch((error) => CustomError.handleError(error, res));
    }
}
