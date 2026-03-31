import {isValidRequiredNumber} from '@domain/dtos/book/helpers';
import {IRemoveFromBookshelfDto} from '@domain/interfaces/bookshelfBook.interfaces';
import {INVALID_OBJECT_ERROR} from '@domain/constants/bookshelfBook.constants';

export class RemoveFromBookshelfDto {
    constructor(public readonly bookshelfBookId: number) {}

    static create(object?: IRemoveFromBookshelfDto): [string?, RemoveFromBookshelfDto?] {
        if (!object) return [INVALID_OBJECT_ERROR];
        let {bookshelfBookId} = object;

        const [bookshelfBookIdError, parsedBookshelfBookId = 0] = isValidRequiredNumber(
            'bookshelfBookId',
            bookshelfBookId
        );
        if (bookshelfBookIdError) return [bookshelfBookIdError];
        bookshelfBookId = parsedBookshelfBookId;

        return [undefined, new RemoveFromBookshelfDto(bookshelfBookId)];
    }
}
