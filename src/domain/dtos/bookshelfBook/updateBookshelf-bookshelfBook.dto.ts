import { isValidRequiredNumber } from "@domain/dtos/book/helpers";
import { IUpdateBookshelfDto } from "@domain/interfaces/bookshelfBook.interfaces";
import { INVALID_OBJECT_ERROR } from "@domain/constants/bookshelfBook.constants";

export class UpdateBookshelfDto{
    constructor(
        public readonly bookshelfBookId: number,
        public readonly bookshelfId: number,
        public bookshelfType?: string,
    ){};

    static create(object?: IUpdateBookshelfDto): [string?, UpdateBookshelfDto?]{
        if(!object) return [INVALID_OBJECT_ERROR];
        let {bookshelfId, bookshelfBookId} = object;

        const [bookshelfBookIdError, parsedBookshelfBookId = 0] = isValidRequiredNumber('bookshelfBookId', bookshelfBookId);
        if(bookshelfBookIdError) return [bookshelfBookIdError];
        bookshelfBookId = parsedBookshelfBookId;

        const [bookshelfIdError, parsedBookshelfId = 0] = isValidRequiredNumber('bookshelfId', bookshelfId);
        if(bookshelfIdError) return [bookshelfIdError];
        bookshelfId = parsedBookshelfId;

        return [undefined, new UpdateBookshelfDto(bookshelfBookId, bookshelfId)];
    }
}