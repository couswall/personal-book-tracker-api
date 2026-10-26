import {CreateReadingChallengeDto} from '@domain/dtos';
import {ReadingChallengeEntity} from '@domain/entities';
import {ReadingChallengeRepository} from '@domain/repositories/readingChallenge.repository';
import {CreateReadingChallengeUseCase} from '@domain/use-cases/interfaces/readingChallenge.interfaces';

export class CreateReadingChallenge implements CreateReadingChallengeUseCase {
    constructor(private readonly repository: ReadingChallengeRepository) {}

    execute(
        {year, goal}: CreateReadingChallengeDto,
        userId: number
    ): Promise<ReadingChallengeEntity> {
        return this.repository.create({userId, year, goal});
    }
}
