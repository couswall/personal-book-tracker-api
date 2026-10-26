import {
    isValidNullString,
    isValidString,
    isValidStringArray,
} from '@domain/dtos/book/helpers';
import {BOOK_DTO_ERRORS} from '@domain/constants/book.constants';
import {ICreateBookDtoObj} from '@domain/interfaces/book.interfaces';

export class CreateBookDto {
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
        public readonly pageCount: number
    ) {}

    private static validateNumericField(
        value: number | undefined | null,
        requiredError: string,
        typeError: string
    ): string | undefined {
        if (value === undefined || value === null) return requiredError;
        if (typeof value !== 'number') return typeError;
        return undefined;
    }

    private static validateStrings(object: ICreateBookDtoObj): string | undefined {
        const [apiBookIdError] = isValidString(
            'apiBookId',
            object.apiBookId,
            2,
            50,
            true
        );
        if (apiBookIdError) return apiBookIdError;
        const [titleError] = isValidString('title', object.title, 1, 80, true);
        if (titleError) return titleError;
        const subtitleError = isValidNullString('subtitle', object.subtitle, 3, 100);
        if (subtitleError) return subtitleError;
        const authorsError = isValidStringArray('authors', object.authors);
        if (authorsError) return authorsError;
        const descriptionError = isValidNullString('description', object.description, 3);
        if (descriptionError) return descriptionError;
        if (object.publishedDate !== null && !(object.publishedDate instanceof Date))
            return BOOK_DTO_ERRORS.CREATE_BOOK.PUBLISHED_DATE.REQUIRED;
        const categoriesError = isValidStringArray('categories', object.categories);
        if (categoriesError) return categoriesError;
        return isValidNullString('coverImageUrl', object.coverImageUrl, 3);
    }

    static validate(object: ICreateBookDtoObj): string | undefined {
        const strError = CreateBookDto.validateStrings(object);
        if (strError) return strError;

        return (
            CreateBookDto.validateNumericField(
                object.averageRating,
                BOOK_DTO_ERRORS.CREATE_BOOK.AVERAGE_RATING.REQUIRED,
                BOOK_DTO_ERRORS.CREATE_BOOK.AVERAGE_RATING.NUMBER
            ) ??
            CreateBookDto.validateNumericField(
                object.reviewCount,
                BOOK_DTO_ERRORS.CREATE_BOOK.REVIEW_COUNT.REQUIRED,
                BOOK_DTO_ERRORS.CREATE_BOOK.REVIEW_COUNT.NUMBER
            ) ??
            CreateBookDto.validateNumericField(
                object.pageCount,
                BOOK_DTO_ERRORS.CREATE_BOOK.PAGE_COUNT.REQUIRED,
                BOOK_DTO_ERRORS.CREATE_BOOK.PAGE_COUNT.NUMBER
            )
        );
    }

    static create(object: ICreateBookDtoObj): [string?, CreateBookDto?] {
        const error = this.validate(object);
        if (error) return [error];

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
            object.pageCount
        );

        return [undefined, createBookDto];
    }
}
