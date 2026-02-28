import { isValidString } from "@domain/dtos/book/helpers";

export class GetBookByIdDto{
    constructor(
        public readonly bookId: string,
    ){};

    static create(bookId?: string): [string?, GetBookByIdDto?]{
        const [bookIdError, trimmedBookId = ''] = isValidString('bookId', bookId, 0, 30, true);
        if(bookIdError) return [bookIdError];

        return [undefined, new GetBookByIdDto(trimmedBookId)];
    }
};