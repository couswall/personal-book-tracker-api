import { BOOK_SHELF_DTO_ERRORS } from "@domain/constants/bookshelf.constants";
import { ICreateCustomBookShelfDto } from "@domain/interfaces/bookshelf.interfaces";

export class CreateCustomBookShelfDto{
    constructor(
        public readonly userId: number,
        public readonly shelfName: string,
    ){};

    static validate(object: ICreateCustomBookShelfDto): string | null{
        const {userId, shelfName} = object;

        if(!userId) return BOOK_SHELF_DTO_ERRORS.CREATE_CUSTOM_BOOKSHELF.USER_ID.REQUIRED;
        if(typeof userId !== 'number') return BOOK_SHELF_DTO_ERRORS.CREATE_CUSTOM_BOOKSHELF.USER_ID.NUMBER;
        
        if(!shelfName) return BOOK_SHELF_DTO_ERRORS.CREATE_CUSTOM_BOOKSHELF.SHELF_NAME.REQUIRED;
        if(typeof shelfName !== 'string') return BOOK_SHELF_DTO_ERRORS.CREATE_CUSTOM_BOOKSHELF.SHELF_NAME.STRING;
        if(shelfName.trim().length === 0) return BOOK_SHELF_DTO_ERRORS.CREATE_CUSTOM_BOOKSHELF.SHELF_NAME.BLANK_SPACES;
        if(shelfName.length < 2) return BOOK_SHELF_DTO_ERRORS.CREATE_CUSTOM_BOOKSHELF.SHELF_NAME.MIN_LENGTH;
        if(shelfName.length > 90) return BOOK_SHELF_DTO_ERRORS.CREATE_CUSTOM_BOOKSHELF.SHELF_NAME.MAX_LENGTH;

        return null;
    };

    static create(object: ICreateCustomBookShelfDto): [string?, CreateCustomBookShelfDto?]{
        const {userId = 0, shelfName = ''} = object;
        const error = this.validate(object);
        if(error) return [error];

        return [undefined, new CreateCustomBookShelfDto(userId, shelfName.trim())];
    };

    
}