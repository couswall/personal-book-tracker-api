import {isValidRequiredNumber} from '@domain/dtos/book/helpers';
import {isReadingProgressType} from '@domain/dtos/bookshelfBook/helpers';
import {
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
        public readonly isFinished: boolean = false
    ) {}

    static create(
        object?: IUpdateReadingProgressDto
    ): [string?, UpdateReadingProgressDto?] {
        if (!object) return [INVALID_OBJECT_ERROR];
        const {bookshelfBookId, progressType, value, isFinished = false} = object;

        const [bookshelfBookIdError, parsedBookshelfBookId = 0] = isValidRequiredNumber(
            'bookshelfBookId',
            bookshelfBookId
        );
        if (bookshelfBookIdError) return [bookshelfBookIdError];

        if (!progressType)
            return [
                BOOKSHELF_BOOK_DTO_ERRORS.UPDATE_READING_PROGRESS.PROGRESS_TYPE.REQUIRED,
            ];
        if (!isReadingProgressType(progressType))
            return [
                BOOKSHELF_BOOK_DTO_ERRORS.UPDATE_READING_PROGRESS.PROGRESS_TYPE.INVALID,
            ];

        const [valueError, parsedValue = 0] = isValidRequiredNumber('value', value);
        if (valueError) return [valueError];

        if (typeof isFinished !== 'boolean')
            return [
                BOOKSHELF_BOOK_DTO_ERRORS.UPDATE_READING_PROGRESS.IS_FINISHED.BOOLEAN,
            ];

        return [
            undefined,
            new UpdateReadingProgressDto(
                parsedBookshelfBookId,
                progressType,
                parsedValue,
                isFinished
            ),
        ];
    }
}
