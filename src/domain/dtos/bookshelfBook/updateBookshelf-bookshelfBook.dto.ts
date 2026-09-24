import {BookshelfType} from '@/generated/prisma';
import {isValidRequiredNumber} from '@domain/dtos/book/helpers';
import {parseFinishedAt} from '@domain/dtos/bookshelfBook/helpers';
import {IUpdateBookshelfDto} from '@domain/interfaces/bookshelfBook.interfaces';
import {
    INVALID_OBJECT_ERROR,
    BOOKSHELF_BOOK_DTO_ERRORS,
} from '@domain/constants/bookshelfBook.constants';

export class UpdateBookshelfDto {
    constructor(
        public readonly bookshelfBookId: number,
        public readonly bookshelfId: number,
        public bookshelfType?: BookshelfType,
        public readonly finishedAt?: Date | null,
        public readonly discardLastRead: boolean = false
    ) {}

    static create(object?: IUpdateBookshelfDto): [string?, UpdateBookshelfDto?] {
        if (!object) return [INVALID_OBJECT_ERROR];
        let {bookshelfId, bookshelfBookId} = object;
        const {discardLastRead = false} = object;

        const [bookshelfBookIdError, parsedBookshelfBookId = 0] = isValidRequiredNumber(
            'bookshelfBookId',
            bookshelfBookId
        );
        if (bookshelfBookIdError) return [bookshelfBookIdError];
        bookshelfBookId = parsedBookshelfBookId;

        const [bookshelfIdError, parsedBookshelfId = 0] = isValidRequiredNumber(
            'bookshelfId',
            bookshelfId
        );
        if (bookshelfIdError) return [bookshelfIdError];
        bookshelfId = parsedBookshelfId;

        const [finishedAtError, finishedAt] = parseFinishedAt(object.finishedAt);
        if (finishedAtError) return [finishedAtError];

        if (typeof discardLastRead !== 'boolean')
            return [BOOKSHELF_BOOK_DTO_ERRORS.UPDATE_BOOKSHELF.DISCARD_LAST_READ.BOOLEAN];

        return [
            undefined,
            new UpdateBookshelfDto(
                bookshelfBookId,
                bookshelfId,
                undefined,
                finishedAt,
                discardLastRead
            ),
        ];
    }
}
