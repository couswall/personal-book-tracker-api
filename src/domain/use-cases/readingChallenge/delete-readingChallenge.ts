import {ReadingChallengeYearDto} from '@domain/dtos';
import {ReadingChallengeEntity} from '@domain/entities';
import {ReadingChallengeRepository} from '@domain/repositories/readingChallenge.repository';
import {DeleteReadingChallengeUseCase} from '@domain/use-cases/interfaces/readingChallenge.interfaces';

export class DeleteReadingChallenge implements DeleteReadingChallengeUseCase {
    constructor(private readonly repository: ReadingChallengeRepository) {}

    execute(
        {year}: ReadingChallengeYearDto,
        userId: number
    ): Promise<ReadingChallengeEntity> {
        return this.repository.delete({userId, year});
    }
}
