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

    private static parseBookId(bookId?: number): [string?, number?] {
        if (!bookId) return [undefined, bookId];
        return isValidRequiredNumber('bookId', bookId);
    }

    private static parseBookshelfType(bookshelfType?: string): [string?, string?] {
        if (!bookshelfType) return [undefined, bookshelfType];
        return isValidString('bookshelfType', bookshelfType);
    }

    static create(object: IAddToBookshelfDto): [string?, AddToBookshelfDto?] {
        const {totalPages = null} = object;
        let {bookshelfId, apiBookId, bookId, bookshelfType} = object;

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

        const [bookIdError, parsedBookId] = AddToBookshelfDto.parseBookId(bookId);
        if (bookIdError) return [bookIdError];
        bookId = parsedBookId;

        const [bookshelfTypeError, trimmedBookshelfType] =
            AddToBookshelfDto.parseBookshelfType(bookshelfType);
        if (bookshelfTypeError) return [bookshelfTypeError];
        bookshelfType = trimmedBookshelfType;

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
