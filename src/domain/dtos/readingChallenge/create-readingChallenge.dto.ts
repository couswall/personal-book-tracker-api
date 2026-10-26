import {INVALID_OBJECT_ERROR} from '@domain/constants/bookshelfBook.constants';
import {parseEditableYear, parseGoal} from '@domain/dtos/readingChallenge/helpers';
import {ICreateReadingChallengeDto} from '@domain/interfaces/readingChallenge.interfaces';

export class CreateReadingChallengeDto {
    constructor(
        public readonly year: number,
        public readonly goal: number
    ) {}

    static create(
        object?: ICreateReadingChallengeDto,
        now: Date = new Date()
    ): [string?, CreateReadingChallengeDto?] {
        if (!object) return [INVALID_OBJECT_ERROR];
        const {year = now.getUTCFullYear(), goal} = object;

        const [yearError, parsedYear = 0] = parseEditableYear(year, now);
        if (yearError) return [yearError];

        const [goalError, parsedGoal = 0] = parseGoal(goal);
        if (goalError) return [goalError];

        return [undefined, new CreateReadingChallengeDto(parsedYear, parsedGoal)];
    }
}
