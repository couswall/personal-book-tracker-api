import {ReadingChallengeEntity} from '@domain/entities';
import {
    IReadingChallengeData,
    IReadingChallengeKey,
} from '@domain/interfaces/readingChallenge.interfaces';

export abstract class ReadingChallengeDatasource {
    abstract create(data: IReadingChallengeData): Promise<ReadingChallengeEntity>;
    abstract update(data: IReadingChallengeData): Promise<ReadingChallengeEntity>;
    abstract delete(key: IReadingChallengeKey): Promise<ReadingChallengeEntity>;
}
