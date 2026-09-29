import {UpdateReadingChallengeDto} from '@domain/dtos';
import {ReadingChallengeEntity} from '@domain/entities';
import {ReadingChallengeRepository} from '@domain/repositories/readingChallenge.repository';
import {UpdateReadingChallengeUseCase} from '@domain/use-cases/interfaces/readingChallenge.interfaces';

export class UpdateReadingChallenge implements UpdateReadingChallengeUseCase {
    constructor(private readonly repository: ReadingChallengeRepository) {}

    execute(
        {year, goal}: UpdateReadingChallengeDto,
        userId: number
    ): Promise<ReadingChallengeEntity> {
        return this.repository.update({userId, year, goal});
    }
}
