import {ReadingChallengeDatasource} from '@domain/datasources/readingChallenge.datasource';
import {ReadingChallengeEntity} from '@domain/entities';
import {
    IReadingChallengeData,
    IReadingChallengeKey,
} from '@domain/interfaces/readingChallenge.interfaces';
import {ReadingChallengeRepository} from '@domain/repositories/readingChallenge.repository';

export class ReadingChallengeRepositoryImpl implements ReadingChallengeRepository {
    constructor(private readonly datasource: ReadingChallengeDatasource) {}

    create(data: IReadingChallengeData): Promise<ReadingChallengeEntity> {
        return this.datasource.create(data);
    }

    update(data: IReadingChallengeData): Promise<ReadingChallengeEntity> {
        return this.datasource.update(data);
    }

    delete(key: IReadingChallengeKey): Promise<ReadingChallengeEntity> {
        return this.datasource.delete(key);
    }
}
