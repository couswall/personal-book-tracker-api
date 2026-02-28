import {isValidRequiredNumber, isValidString} from '@domain/dtos/book/helpers';
import {IAddToBookshelfDto} from '@domain/interfaces/bookshelfBook.interfaces';

export class AddToBookshelfDto {
    constructor(
        public readonly bookshelfId: number,
        public readonly apiBookId: string,
        public bookId?: number,
        public totalPages?: number | null,
        public bookshelfType?: string
    ) {}

    static create(object: IAddToBookshelfDto): [string?, AddToBookshelfDto?] {
        let {bookshelfId, apiBookId, bookId, bookshelfType, totalPages = null} = object;

        const [bookshelfIdError, parsedBookshelfId = 0] = isValidRequiredNumber(
            'bookshelfId',
            bookshelfId
        );
        if (bookshelfIdError) return [bookshelfIdError];
        bookshelfId = parsedBookshelfId;

        const [apiBookIdError, trimmedApiBookId = ''] = isValidString(
            'apiBookId',
            apiBookId,
            0,
            15,
            true
        );
        if (apiBookIdError) return [apiBookIdError];
        apiBookId = trimmedApiBookId;

        if (bookId) {
            const [bookIdError, parsedBookId = 0] = isValidRequiredNumber(
                'bookId',
                bookId
            );
            if (bookIdError) return [bookIdError];
            bookId = parsedBookId;
        }

        if (bookshelfType) {
            const [bookshelfTypeError, trimmedBookshelfType = ''] = isValidString(
                'bookshelfType',
                bookshelfType
            );
            if (bookshelfTypeError) return [bookshelfTypeError];
            bookshelfType = trimmedBookshelfType;
        }

        return [
            undefined,
            new AddToBookshelfDto(
                bookshelfId,
                apiBookId,
                bookId,
                totalPages,
                bookshelfType
            ),
        ];
    }
}
