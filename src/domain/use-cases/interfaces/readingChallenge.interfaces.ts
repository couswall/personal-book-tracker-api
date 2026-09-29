import {ReadingChallengeEntity} from '@domain/entities';
import {
    IReadingChallengeProgress,
    IReadingChallengeSummary,
} from '@domain/interfaces/readingChallenge.interfaces';
import {
    CreateReadingChallengeDto,
    ReadingChallengeYearDto,
    UpdateReadingChallengeDto,
} from '@domain/dtos';

export interface CreateReadingChallengeUseCase {
    execute(
        dto: CreateReadingChallengeDto,
        userId: number
    ): Promise<ReadingChallengeEntity>;
}

export interface UpdateReadingChallengeUseCase {
    execute(
        dto: UpdateReadingChallengeDto,
        userId: number
    ): Promise<ReadingChallengeEntity>;
}

export interface DeleteReadingChallengeUseCase {
    execute(
        dto: ReadingChallengeYearDto,
        userId: number
    ): Promise<ReadingChallengeEntity>;
}

export interface GetReadingChallengeProgressUseCase {
    execute(
        dto: ReadingChallengeYearDto,
        userId: number,
        now?: Date
    ): Promise<IReadingChallengeProgress>;
}

export interface GetReadingChallengeHistoryUseCase {
    execute(userId: number): Promise<IReadingChallengeSummary[]>;
}
