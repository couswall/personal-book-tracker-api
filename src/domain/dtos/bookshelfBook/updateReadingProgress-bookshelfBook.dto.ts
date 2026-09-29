import {isValidRequiredNumber} from '@domain/dtos/book/helpers';
import {isReadingProgressType, parseFinishedAt} from '@domain/dtos/bookshelfBook/helpers';
import {
    IParsedFinish,
    IUpdateReadingProgressDto,
    ReadingProgressType,
} from '@domain/interfaces/bookshelfBook.interfaces';
import {
    INVALID_OBJECT_ERROR,
    BOOKSHELF_BOOK_DTO_ERRORS,
} from '@domain/constants/bookshelfBook.constants';

export class UpdateReadingProgressDto {
    constructor(
        public readonly bookshelfBookId: number,
        public readonly progressType: ReadingProgressType,
        public readonly value: number,
        public readonly isFinished: boolean = false,
        public readonly finishedAt?: Date | null
    ) {}

    private static parseProgressType(
        progressType?: string
    ): [string?, ReadingProgressType?] {
        const {REQUIRED, INVALID} =
            BOOKSHELF_BOOK_DTO_ERRORS.UPDATE_READING_PROGRESS.PROGRESS_TYPE;
        if (!progressType) return [REQUIRED];
        if (!isReadingProgressType(progressType)) return [INVALID];
        return [undefined, progressType];
    }

    private static parseFinish({
        isFinished = false,
        finishedAt,
    }: IUpdateReadingProgressDto): [string?, IParsedFinish?] {
        if (typeof isFinished !== 'boolean')
            return [
                BOOKSHELF_BOOK_DTO_ERRORS.UPDATE_READING_PROGRESS.IS_FINISHED.BOOLEAN,
            ];

        const [finishedAtError, parsedFinishedAt] = parseFinishedAt(finishedAt);
        if (finishedAtError) return [finishedAtError];

        return [undefined, {isFinished, finishedAt: parsedFinishedAt}];
    }

    static create(
        object?: IUpdateReadingProgressDto
    ): [string?, UpdateReadingProgressDto?] {
        if (!object) return [INVALID_OBJECT_ERROR];
        const {bookshelfBookId, value} = object;

        const [bookshelfBookIdError, parsedBookshelfBookId = 0] = isValidRequiredNumber(
            'bookshelfBookId',
            bookshelfBookId
        );
        if (bookshelfBookIdError) return [bookshelfBookIdError];

        const [progressTypeError, progressType] =
            UpdateReadingProgressDto.parseProgressType(object.progressType);
        if (progressTypeError || !progressType) return [progressTypeError];

        const [valueError, parsedValue = 0] = isValidRequiredNumber('value', value);
        if (valueError) return [valueError];

        const [finishError, finish] = UpdateReadingProgressDto.parseFinish(object);
        if (finishError || !finish) return [finishError];
        const {isFinished, finishedAt} = finish;

        return [
            undefined,
            new UpdateReadingProgressDto(
                parsedBookshelfBookId,
                progressType,
                parsedValue,
                isFinished,
                finishedAt
            ),
        ];
    }
}
