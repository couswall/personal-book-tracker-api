import {CreateBookDto} from '@domain/dtos';
import {createBookDtoObj} from '@tests/fixtures';
import {BOOK_DTO_ERRORS} from '@domain/constants/book.constants';
import {ICreateBookDtoObj} from '@domain/interfaces/book.interfaces';

describe('create-book.dto tests (part 2)', () => {
    describe('categories validation', () => {
        test('should return an error if it is not an array', () => {
            const dtoObject = {
                ...createBookDtoObj,
                categories: 'ab',
            } as unknown as ICreateBookDtoObj;
            const [error, dto] = CreateBookDto.create(dtoObject);

            expect(error).toContain('must be an array');
            expect(dto).toBeUndefined();
        });
        test('should return an error if it is not an array of strings', () => {
            const dtoObject = {
                ...createBookDtoObj,
                categories: [1, false, {name: 'test'}, []],
            } as unknown as ICreateBookDtoObj;
            const [error, dto] = CreateBookDto.create(dtoObject);

            expect(error).toContain('must be an array of strings');
            expect(dto).toBeUndefined();
        });
    });
    describe('coverImageUrl validation', () => {
        test('should return a CreatBookDto instance if it is null', () => {
            const [error, dto] = CreateBookDto.create({
                ...createBookDtoObj,
                coverImageUrl: null,
            });

            expect(error).toBeUndefined();
            expect(dto).toBeInstanceOf(CreateBookDto);
            expect(dto?.coverImageUrl).toBeNull();
        });
        test('should return an error if coverImageUrl length is less than three', () => {
            const [error, dto] = CreateBookDto.create({
                ...createBookDtoObj,
                coverImageUrl: 'ab',
            });

            expect(error).toContain('must contain at least 3 characters');
            expect(dto).toBeUndefined();
        });
        test('should return an error if it contains only blank spaces', () => {
            const [error, dto] = CreateBookDto.create({
                ...createBookDtoObj,
                coverImageUrl: '    ',
            });

            expect(error).toContain('must not contain only blank spaces');
            expect(dto).toBeUndefined();
        });
    });
    describe('averageRating validation', () => {
        test('should create a CreateBookDto instance if the value is zero', () => {
            const [error, dto] = CreateBookDto.create({
                ...createBookDtoObj,
                averageRating: 0,
            });

            expect(error).toBeUndefined();
            expect(dto).toBeInstanceOf(CreateBookDto);
            expect(dto?.averageRating).toBe(0);
        });
        test('should return an error if it is undefined', () => {
            const dtoObject = {
                ...createBookDtoObj,
                averageRating: undefined,
            } as unknown as ICreateBookDtoObj;
            const [error, dto] = CreateBookDto.create(dtoObject);

            expect(error).toBe(BOOK_DTO_ERRORS.CREATE_BOOK.AVERAGE_RATING.REQUIRED);
            expect(dto).toBeUndefined();
        });
        test('should return an error if it is null', () => {
            const dtoObject = {
                ...createBookDtoObj,
                averageRating: null,
            } as unknown as ICreateBookDtoObj;
            const [error, dto] = CreateBookDto.create(dtoObject);

            expect(error).toBe(BOOK_DTO_ERRORS.CREATE_BOOK.AVERAGE_RATING.REQUIRED);
            expect(dto).toBeUndefined();
        });
        test('should return an error if it is not a number', () => {
            const dtoObject = {
                ...createBookDtoObj,
                averageRating: '1234',
            } as unknown as ICreateBookDtoObj;
            const [error, dto] = CreateBookDto.create(dtoObject);

            expect(error).toBe(BOOK_DTO_ERRORS.CREATE_BOOK.AVERAGE_RATING.NUMBER);
            expect(dto).toBeUndefined();
        });
    });
    describe('reviewCount validation', () => {
        test('should create a CreateBookDto instance if the value is zero', () => {
            const [error, dto] = CreateBookDto.create({
                ...createBookDtoObj,
                reviewCount: 0,
            });

            expect(error).toBeUndefined();
            expect(dto).toBeInstanceOf(CreateBookDto);
            expect(dto?.reviewCount).toBe(0);
        });
        test('should return an error if it is undefined', () => {
            const dtoObject = {
                ...createBookDtoObj,
                reviewCount: undefined,
            } as unknown as ICreateBookDtoObj;
            const [error, dto] = CreateBookDto.create(dtoObject);

            expect(error).toBe(BOOK_DTO_ERRORS.CREATE_BOOK.REVIEW_COUNT.REQUIRED);
            expect(dto).toBeUndefined();
        });
        test('should return an error if it is null', () => {
            const dtoObject = {
                ...createBookDtoObj,
                reviewCount: null,
            } as unknown as ICreateBookDtoObj;
            const [error, dto] = CreateBookDto.create(dtoObject);

            expect(error).toBe(BOOK_DTO_ERRORS.CREATE_BOOK.REVIEW_COUNT.REQUIRED);
            expect(dto).toBeUndefined();
        });
        test('should return an error if it is not a number', () => {
            const dtoObject = {
                ...createBookDtoObj,
                reviewCount: '1234',
            } as unknown as ICreateBookDtoObj;
            const [error, dto] = CreateBookDto.create(dtoObject);

            expect(error).toBe(BOOK_DTO_ERRORS.CREATE_BOOK.REVIEW_COUNT.NUMBER);
            expect(dto).toBeUndefined();
        });
    });
    describe('pageCount validation', () => {
        test('should create a CreateBookDto instance if the value is zero', () => {
            const [error, dto] = CreateBookDto.create({
                ...createBookDtoObj,
                pageCount: 0,
            });

            expect(error).toBeUndefined();
            expect(dto).toBeInstanceOf(CreateBookDto);
            expect(dto?.pageCount).toBe(0);
        });
        test('should return an error if it is undefined', () => {
            const dtoObject = {
                ...createBookDtoObj,
                pageCount: undefined,
            } as unknown as ICreateBookDtoObj;
            const [error, dto] = CreateBookDto.create(dtoObject);

            expect(error).toBe(BOOK_DTO_ERRORS.CREATE_BOOK.PAGE_COUNT.REQUIRED);
            expect(dto).toBeUndefined();
        });
        test('should return an error if it is null', () => {
            const dtoObject = {
                ...createBookDtoObj,
                pageCount: null,
            } as unknown as ICreateBookDtoObj;
            const [error, dto] = CreateBookDto.create(dtoObject);

            expect(error).toBe(BOOK_DTO_ERRORS.CREATE_BOOK.PAGE_COUNT.REQUIRED);
            expect(dto).toBeUndefined();
        });
        test('should return an error if it is not a number', () => {
            const dtoObject = {
                ...createBookDtoObj,
                pageCount: '1234',
            } as unknown as ICreateBookDtoObj;
            const [error, dto] = CreateBookDto.create(dtoObject);

            expect(error).toBe(BOOK_DTO_ERRORS.CREATE_BOOK.PAGE_COUNT.NUMBER);
            expect(dto).toBeUndefined();
        });
    });
});
