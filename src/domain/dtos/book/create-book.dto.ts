import { isValidNullString, isValidString, isValidStringArray } from "@domain/dtos/book/helpers";
import { BOOK_DTO_ERRORS } from "@domain/constants/book.constants";
import { ICreateBookDtoObj } from "@domain/interfaces/book.interfaces";

export class CreateBookDto{
    constructor(
        public readonly apiBookId: string,
        public readonly title: string,
        public readonly subtitle: string | null,
        public readonly authors: string[],
        public readonly description: string | null,
        public readonly publishedDate: Date | null,
        public readonly coverImageUrl: string | null,
        public readonly categories: string[],
        public readonly averageRating: number,
        public readonly reviewCount: number,
        public readonly pageCount: number,
    ){};

    static validate(object: ICreateBookDtoObj): string | undefined{

        const [apiBookIdError] = isValidString('apiBookId', object.apiBookId, 2, 50, true);
        if(apiBookIdError) return apiBookIdError;

        const [titleError] = isValidString('title', object.title, 1, 80, true);
        if(titleError) return titleError;

        const subtitleError = isValidNullString('subtitle', object.subtitle, 3, 100);
        if(subtitleError) return subtitleError;

        const authorsError = isValidStringArray('authors', object.authors);
        if(authorsError) return authorsError;

        const descriptionError = isValidNullString('description', object.description, 3);
        if(descriptionError) return descriptionError;

        if(object.publishedDate !== null && !(object.publishedDate instanceof Date))
            return BOOK_DTO_ERRORS.CREATE_BOOK.PUBLISHED_DATE.REQUIRED;
        
        const categoriesError = isValidStringArray('categories', object.categories);
        if(categoriesError) return categoriesError;

        const coverImageUrlError = isValidNullString('coverImageUrl', object.coverImageUrl, 3);
        if(coverImageUrlError) return coverImageUrlError;
        
        if(object.averageRating === undefined || object.averageRating === null) return BOOK_DTO_ERRORS.CREATE_BOOK.AVERAGE_RATING.REQUIRED;
        if(typeof object.averageRating !== 'number') return BOOK_DTO_ERRORS.CREATE_BOOK.AVERAGE_RATING.NUMBER;
        
        if(object.reviewCount === undefined || object.reviewCount === null) return BOOK_DTO_ERRORS.CREATE_BOOK.REVIEW_COUNT.REQUIRED;
        if(typeof object.reviewCount !== 'number') return BOOK_DTO_ERRORS.CREATE_BOOK.REVIEW_COUNT.NUMBER;
        
        if(object.pageCount === undefined || object.pageCount === null) return BOOK_DTO_ERRORS.CREATE_BOOK.PAGE_COUNT.REQUIRED;
        if(typeof object.pageCount !== 'number') return BOOK_DTO_ERRORS.CREATE_BOOK.PAGE_COUNT.NUMBER;
        
        return undefined;
    };

    static create(object: ICreateBookDtoObj): [string?, CreateBookDto?]{
        const error = this.validate(object);
        if(error) return [error];

        const createBookDto = new CreateBookDto(
            object.apiBookId,
            object.title.trim(),
            object.subtitle,
            object.authors,
            object.description,
            object.publishedDate,
            object.coverImageUrl,
            object.categories,
            object.averageRating,
            object.reviewCount,
            object.pageCount,
        );
        
        return[undefined, createBookDto];
    };
}