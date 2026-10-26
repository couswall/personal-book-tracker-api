import {INVALID_OBJECT_ERROR} from '@domain/constants/bookshelfBook.constants';
import {parseYear} from '@domain/dtos/readingChallenge/helpers';
import {IReadingChallengeYearDto} from '@domain/interfaces/readingChallenge.interfaces';

/** Identifies a challenge by year. Any valid year is allowed (e.g. deleting past ones). */
export class ReadingChallengeYearDto {
    constructor(public readonly year: number) {}

    static create(
        object?: IReadingChallengeYearDto
    ): [string?, ReadingChallengeYearDto?] {
        if (!object) return [INVALID_OBJECT_ERROR];

        const [yearError, parsedYear = 0] = parseYear(object.year);
        if (yearError) return [yearError];

        return [undefined, new ReadingChallengeYearDto(parsedYear)];
    }
}
