import { SearchBookDto } from "@domain/dtos";
import { searchBookDtoObj } from "@tests/fixtures";
import { INVALID_OBJECT_ERROR } from "@domain/constants/bookshelfBook.constants";
import { ISearchBookDto, PrintTypeEnum } from "@domain/interfaces/book.interfaces";
import { BOOK_DTO_ERRORS } from "@domain/constants/book.constants";

describe('search-book.dto tests', () => {
    test('should create a SearchBookDto instance from a valid object', () => {
        const [error, dto] = SearchBookDto.create(searchBookDtoObj);

        expect(error).toBeUndefined();
        expect(dto).toBeInstanceOf(SearchBookDto);
    });

    test('should return an error if object is undefined', () => {
        const [error, dto] = SearchBookDto.create(undefined);

        expect(error).toBe(INVALID_OBJECT_ERROR);
        expect(dto).toBeUndefined();
    });

    test('should return an error if object is empty', () => {
        const [error, dto] = SearchBookDto.create({});

        expect(!!error).toBeTruthy();
        expect(dto).toBeUndefined();
    });
    // TODO: Implement validations
    describe('searchText validation', () => {
        test('should contain at least one character', () => {
            const [error, dto] = SearchBookDto.create({...searchBookDtoObj, searchText: ''});

            expect(error).toContain('is required');
            expect(dto).toBeUndefined();
        });
        test('should contain at most fifty character', () => {
            const [error, dto] = SearchBookDto.create({...searchBookDtoObj, searchText: 'a'.repeat(51)});

            expect(error).toContain('must contain at most 50 characters');
            expect(dto).toBeUndefined();
        });
        test('should not contain only blank spaces', () => {
            const [error, dto] = SearchBookDto.create({...searchBookDtoObj, searchText: '   '});

            expect(error).toContain('must not contain only blank spaces');
            expect(dto).toBeUndefined();
        });
        test('should be a string type', () => {
            const dtoObj = {...searchBookDtoObj, searchText: 123} as unknown as ISearchBookDto;
            const [error, dto] = SearchBookDto.create(dtoObj);

            expect(error).toContain('must be a string');
            expect(dto).toBeUndefined();
        });
    });

    describe('page validation', () => {
        test('should set one as default value', () => {
            const [error, dto] = SearchBookDto.create({...searchBookDtoObj, page: undefined});

            expect(error).toBeUndefined();
            expect(dto).toBeInstanceOf(SearchBookDto);
            expect(dto?.page).toBe(1);
        });
        test('should return an error if page is not a number or string', () => {
            const dtoObj = {...searchBookDtoObj, page: true} as unknown as ISearchBookDto;
            const [error, dto] = SearchBookDto.create(dtoObj);

            expect(error).toContain('must be a number');
            expect(dto).toBeUndefined();
        });
        test('should return an error if page is not a number as string', () => {
            const dtoObj = {...searchBookDtoObj, page: 'abc'} as unknown as ISearchBookDto;
            const [error, dto] = SearchBookDto.create(dtoObj);

            expect(error).toContain('must be a number');
            expect(dto).toBeUndefined();
        });
    });

    describe('printType validation', () => {
        test('should set books as default value', () => {
            const [error, dto] = SearchBookDto.create({ ...searchBookDtoObj, printType: undefined });

            expect(error).toBeUndefined();
            expect(dto).toBeInstanceOf(SearchBookDto);
            expect(dto?.printType).toBe(PrintTypeEnum.Books);
        });

        test('should return an error when it is not a PrintTypeEnum', () => {
            const dtoObj = {...searchBookDtoObj, printType: 'invalid'} as unknown as ISearchBookDto;
            const [error, dto] = SearchBookDto.create(dtoObj);

            expect(error).toBe(BOOK_DTO_ERRORS.SEARCH_BOOK.PRINT_TYPE.TYPE);
            expect(dto).toBeUndefined();
        });

        test('should return an error if it is not a string', () => {
            const dtoObj = {...searchBookDtoObj, printType: 1234} as unknown as ISearchBookDto;
            const [error, dto] = SearchBookDto.create(dtoObj);

            expect(error).toBe(BOOK_DTO_ERRORS.SEARCH_BOOK.PRINT_TYPE.TYPE);
            expect(dto).toBeUndefined();
        });

        test('should accept PrintTypeEnum.Magazines', () => {
            const [error, dto] = SearchBookDto.create({ ...searchBookDtoObj, printType: PrintTypeEnum.Magazines });

            expect(error).toBeUndefined();
            expect(dto).toBeInstanceOf(SearchBookDto);
            expect(dto?.printType).toBe(PrintTypeEnum.Magazines);
        });
    });

    describe('maxResults validation', () => {
        test('should set ten as default value', () => {
            const [error, dto] = SearchBookDto.create({...searchBookDtoObj, maxResults: undefined});

            expect(error).toBeUndefined();
            expect(dto).toBeInstanceOf(SearchBookDto);
            expect(dto?.maxResults).toBe(10);
        });
        test('should return an error if page is not a number or string', () => {
            const dtoObj = {...searchBookDtoObj, maxResults: true} as unknown as ISearchBookDto;
            const [error, dto] = SearchBookDto.create(dtoObj);

            expect(error).toContain('must be a number');
            expect(dto).toBeUndefined();
        });
        test('should return an error if page is not a number as string', () => {
            const dtoObj = {...searchBookDtoObj, maxResults: 'abc'} as unknown as ISearchBookDto;
            const [error, dto] = SearchBookDto.create(dtoObj);

            expect(error).toContain('must be a number');
            expect(dto).toBeUndefined();
        });
    });
});