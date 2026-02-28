import { CreateBookDto } from "@domain/dtos";
import { createBookDtoObj } from "@tests/fixtures";
import { BOOK_DTO_ERRORS } from "@domain/constants/book.constants";
import { ICreateBookDtoObj } from "@domain/interfaces/book.interfaces";

describe('create-book.dto tests', () => {
    test('should return a CreateBookDto instance from a valid object', () => {
        const [error, dto] = CreateBookDto.create(createBookDtoObj);

        expect(error).toBeUndefined();
        expect(dto).toBeInstanceOf(CreateBookDto);
        expect(dto?.apiBookId).toBe(createBookDtoObj.apiBookId);
    });

    describe('apiBookId validation', () => {
        test('should return an error if it is undefined', () => {
            const dtoObject = {...createBookDtoObj, apiBookId: undefined} as unknown as ICreateBookDtoObj;
            const [error, dto] = CreateBookDto.create(dtoObject);

            expect(error).toContain('is required');
            expect(dto).toBeUndefined();
        });
        test('should return an error if it does not contain at least two characters', () => {
            const [error, dto] = CreateBookDto.create({...createBookDtoObj, apiBookId: 'a'});

            expect(error).toContain('must contain at least 2 characters');
            expect(dto).toBeUndefined();
        });
        test('should return an error if it does not contain at most fifty characters', () => {
            const [error, dto] = CreateBookDto.create({...createBookDtoObj, apiBookId: 'a'.repeat(51)});

            expect(error).toContain('must contain at most 50 characters');
            expect(dto).toBeUndefined();
        });
        test('should return an error if it contains only blank spaces', () => {
            const [error, dto] = CreateBookDto.create({...createBookDtoObj, apiBookId: '  '});

            expect(error).toContain('must not contain only blank spaces');
            expect(dto).toBeUndefined();
        });
    });

    describe('title validation', () => {
        test('should return an error if it is undefined', () => {
            const dtoObject = {...createBookDtoObj, title: undefined} as unknown as ICreateBookDtoObj;
            const [error, dto] = CreateBookDto.create(dtoObject);

            expect(error).toContain('is required');
            expect(dto).toBeUndefined();
        });
        test('should return an error if it is an empty string', () => {
            const [error, dto] = CreateBookDto.create({...createBookDtoObj, title: ''});

            expect(!!error).toBeTruthy();
            expect(dto).toBeUndefined();
        });
        test('should return an error if it does not contain at most eighty characters', () => {
            const [error, dto] = CreateBookDto.create({...createBookDtoObj, title: 'a'.repeat(81)});

            expect(error).toContain('must contain at most 80 characters');
            expect(dto).toBeUndefined();
        });
        test('should return an error if it contains only blank spaces', () => {
            const [error, dto] = CreateBookDto.create({...createBookDtoObj, title: '  '});

            expect(error).toContain('must not contain only blank spaces');
            expect(dto).toBeUndefined();
        });
    });
    describe('subtitle validation', () => {
        test('should return a CreatBookDto instance if it is null', () => {
            const [error, dto] = CreateBookDto.create({...createBookDtoObj, subtitle: null});

            expect(error).toBeUndefined();
            expect(dto).toBeInstanceOf(CreateBookDto);
            expect(dto?.subtitle).toBeNull();
        });
        test('should return an error if it does not contain at least three characters', () => {
            const [error, dto] = CreateBookDto.create({...createBookDtoObj, subtitle: 'ab'});

            expect(error).toContain('must contain at least 3 characters');
            expect(dto).toBeUndefined();
        });
        test('should return an error if it does not contain at most one hundred one characters', () => {
            const [error, dto] = CreateBookDto.create({...createBookDtoObj, subtitle: 'a'.repeat(101)});

            expect(error).toContain('must contain at most 100 characters');
            expect(dto).toBeUndefined();
        });
        test('should return an error if it contains only blank spaces', () => {
            const [error, dto] = CreateBookDto.create({...createBookDtoObj, subtitle: '    '});

            expect(error).toContain('must not contain only blank spaces');
            expect(dto).toBeUndefined();
        });
    });
    describe('authors validation', () => {
        test('should return an error if it is not an array', () => {
            const dtoObject = {...createBookDtoObj, authors: 'ab'} as unknown as ICreateBookDtoObj
            const [error, dto] = CreateBookDto.create(dtoObject);

            expect(error).toContain('must be an array');
            expect(dto).toBeUndefined();
        });
        test('should return an error if it is not an array of strings', () => {
            const dtoObject = {...createBookDtoObj, authors: [1, false, {name: 'test'}, []]} as unknown as ICreateBookDtoObj
            const [error, dto] = CreateBookDto.create(dtoObject);

            expect(error).toContain('must be an array of strings');
            expect(dto).toBeUndefined();
        });   
    });
    describe('description validation', () => {
        test('should return a CreatBookDto instance if it is null', () => {
            const [error, dto] = CreateBookDto.create({...createBookDtoObj, description: null});

            expect(error).toBeUndefined();
            expect(dto).toBeInstanceOf(CreateBookDto);
            expect(dto?.description).toBeNull();
        });
        test('should return an error if it does not contain at least three characters', () => {
            const [error, dto] = CreateBookDto.create({...createBookDtoObj, description: 'ab'});

            expect(error).toContain('must contain at least 3 characters');
            expect(dto).toBeUndefined();
        });
        test('should return an error if it contains only blank spaces', () => {
            const [error, dto] = CreateBookDto.create({...createBookDtoObj, description: '    '});

            expect(error).toContain('must not contain only blank spaces');
            expect(dto).toBeUndefined();
        });
    });
    describe('publishedDate validation', () => {
        test('should create a CreateBookDto instance if it is null', () => {
            const [error, dto] = CreateBookDto.create({...createBookDtoObj, publishedDate: null});

            expect(error).toBeUndefined();
            expect(dto).toBeInstanceOf(CreateBookDto);
            expect(dto?.publishedDate).toBeNull();
        });
        test('should return an error if it is not a Date instance', () => {
            const dtoObject = {...createBookDtoObj, publishedDate: '2023-01-01'} as unknown as ICreateBookDtoObj;
            const [error, dto] = CreateBookDto.create(dtoObject);

            expect(error).toBe(BOOK_DTO_ERRORS.CREATE_BOOK.PUBLISHED_DATE.REQUIRED);
            expect(dto).toBeUndefined();
        });
        test('should return an error if it is undefined', () => {
            const dtoObject = {...createBookDtoObj, publishedDate: undefined} as unknown as ICreateBookDtoObj;
            const [error, dto] = CreateBookDto.create(dtoObject);

            expect(error).toBe(BOOK_DTO_ERRORS.CREATE_BOOK.PUBLISHED_DATE.REQUIRED);
            expect(dto).toBeUndefined();
        });
    });
    describe('categories validation', () => {
        test('should return an error if it is not an array', () => {
            const dtoObject = {...createBookDtoObj, categories: 'ab'} as unknown as ICreateBookDtoObj;
            const [error, dto] = CreateBookDto.create(dtoObject);

            expect(error).toContain('must be an array');
            expect(dto).toBeUndefined();
        });
        test('should return an error if it is not an array of strings', () => {
            const dtoObject = {...createBookDtoObj, categories: [1, false, {name: 'test'}, []]} as unknown as ICreateBookDtoObj;
            const [error, dto] = CreateBookDto.create(dtoObject);

            expect(error).toContain('must be an array of strings');
            expect(dto).toBeUndefined();
        });
    });
    describe('coverImageUrl validation', () => {
        test('should return a CreatBookDto instance if it is null', () => {
            const [error, dto] = CreateBookDto.create({...createBookDtoObj, coverImageUrl: null});

            expect(error).toBeUndefined();
            expect(dto).toBeInstanceOf(CreateBookDto);
            expect(dto?.coverImageUrl).toBeNull();
        });
        test('should return an error if coverImageUrl length is less than three', () => {
            const [error, dto] = CreateBookDto.create({...createBookDtoObj, coverImageUrl: 'ab'});

            expect(error).toContain('must contain at least 3 characters');
            expect(dto).toBeUndefined();
        });
        test('should return an error if it contains only blank spaces', () => {
            const [error, dto] = CreateBookDto.create({...createBookDtoObj, coverImageUrl: '    '});

            expect(error).toContain('must not contain only blank spaces');
            expect(dto).toBeUndefined();
        });
    });
    describe('averageRating validation', () => {
        test('should create a CreateBookDto instance if the value is zero', () => {
            const [error, dto] = CreateBookDto.create({...createBookDtoObj, averageRating: 0});

            expect(error).toBeUndefined();
            expect(dto).toBeInstanceOf(CreateBookDto);
            expect(dto?.averageRating).toBe(0);
        });
        test('should return an error if it is undefined', () => {
            const dtoObject = {...createBookDtoObj, averageRating: undefined} as unknown as ICreateBookDtoObj;
            const [error, dto] = CreateBookDto.create(dtoObject);

            expect(error).toBe(BOOK_DTO_ERRORS.CREATE_BOOK.AVERAGE_RATING.REQUIRED);
            expect(dto).toBeUndefined();
        });
        test('should return an error if it is null', () => {
            const dtoObject = {...createBookDtoObj, averageRating: null} as unknown as ICreateBookDtoObj;
            const [error, dto] = CreateBookDto.create(dtoObject);

            expect(error).toBe(BOOK_DTO_ERRORS.CREATE_BOOK.AVERAGE_RATING.REQUIRED);
            expect(dto).toBeUndefined();
        });
        test('should return an error if it is not a number', () => {
            const dtoObject = {...createBookDtoObj, averageRating: '1234'} as unknown as ICreateBookDtoObj;
            const [error, dto] = CreateBookDto.create(dtoObject);

            expect(error).toBe(BOOK_DTO_ERRORS.CREATE_BOOK.AVERAGE_RATING.NUMBER);
            expect(dto).toBeUndefined();
        });
    });
    describe('reviewCount validation', () => {
        test('should create a CreateBookDto instance if the value is zero', () => {
            const [error, dto] = CreateBookDto.create({...createBookDtoObj, reviewCount: 0});

            expect(error).toBeUndefined();
            expect(dto).toBeInstanceOf(CreateBookDto);
            expect(dto?.reviewCount).toBe(0);
        });
        test('should return an error if it is undefined', () => {
            const dtoObject = {...createBookDtoObj, reviewCount: undefined} as unknown as ICreateBookDtoObj;
            const [error, dto] = CreateBookDto.create(dtoObject);

            expect(error).toBe(BOOK_DTO_ERRORS.CREATE_BOOK.REVIEW_COUNT.REQUIRED);
            expect(dto).toBeUndefined();
        });
        test('should return an error if it is null', () => {
            const dtoObject = {...createBookDtoObj, reviewCount: null} as unknown as ICreateBookDtoObj;
            const [error, dto] = CreateBookDto.create(dtoObject);

            expect(error).toBe(BOOK_DTO_ERRORS.CREATE_BOOK.REVIEW_COUNT.REQUIRED);
            expect(dto).toBeUndefined();
        });
        test('should return an error if it is not a number', () => {
            const dtoObject = {...createBookDtoObj, reviewCount: '1234'} as unknown as ICreateBookDtoObj;
            const [error, dto] = CreateBookDto.create(dtoObject);

            expect(error).toBe(BOOK_DTO_ERRORS.CREATE_BOOK.REVIEW_COUNT.NUMBER);
            expect(dto).toBeUndefined();
        });
    });
    describe('pageCount validation', () => {
        test('should create a CreateBookDto instance if the value is zero', () => {
            const [error, dto] = CreateBookDto.create({...createBookDtoObj, pageCount: 0});

            expect(error).toBeUndefined();
            expect(dto).toBeInstanceOf(CreateBookDto);
            expect(dto?.pageCount).toBe(0);
        });
        test('should return an error if it is undefined', () => {
            const dtoObject = {...createBookDtoObj, pageCount: undefined} as unknown as ICreateBookDtoObj;
            const [error, dto] = CreateBookDto.create(dtoObject);

            expect(error).toBe(BOOK_DTO_ERRORS.CREATE_BOOK.PAGE_COUNT.REQUIRED);
            expect(dto).toBeUndefined();
        });
        test('should return an error if it is null', () => {
            const dtoObject = {...createBookDtoObj, pageCount: null} as unknown as ICreateBookDtoObj;
            const [error, dto] = CreateBookDto.create(dtoObject);

            expect(error).toBe(BOOK_DTO_ERRORS.CREATE_BOOK.PAGE_COUNT.REQUIRED);
            expect(dto).toBeUndefined();
        });
        test('should return an error if it is not a number', () => {
            const dtoObject = {...createBookDtoObj, pageCount: '1234'} as unknown as ICreateBookDtoObj;
            const [error, dto] = CreateBookDto.create(dtoObject);

            expect(error).toBe(BOOK_DTO_ERRORS.CREATE_BOOK.PAGE_COUNT.NUMBER);
            expect(dto).toBeUndefined();
        });
    });
});