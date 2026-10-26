import {INVALID_OBJECT_ERROR} from '@domain/constants/bookshelfBook.constants';
import {parseEditableYear, parseGoal} from '@domain/dtos/readingChallenge/helpers';
import {IUpdateReadingChallengeDto} from '@domain/interfaces/readingChallenge.interfaces';

export class UpdateReadingChallengeDto {
    constructor(
        public readonly year: number,
        public readonly goal: number
    ) {}

    static create(
        object?: IUpdateReadingChallengeDto,
        now: Date = new Date()
    ): [string?, UpdateReadingChallengeDto?] {
        if (!object) return [INVALID_OBJECT_ERROR];

        const [yearError, parsedYear = 0] = parseEditableYear(object.year, now);
        if (yearError) return [yearError];

        const [goalError, parsedGoal = 0] = parseGoal(object.goal);
        if (goalError) return [goalError];

        return [undefined, new UpdateReadingChallengeDto(parsedYear, parsedGoal)];
    }
}
