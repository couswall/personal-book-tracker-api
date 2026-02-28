import {CreateCustomBookShelfDto} from '@domain/dtos';
import {createCustomBookshelfDto} from '@tests/fixtures';
import {BOOK_SHELF_DTO_ERRORS} from '@domain/constants/bookshelf.constants';
import {ICreateCustomBookShelfDto} from '@domain/interfaces/bookshelf.interfaces';

describe('createCustom-bookshelf.dto test', () => {
    test('should create a CreateCustomBookShelfDto instance from a valid object', () => {
        const [error, dto] = CreateCustomBookShelfDto.create(createCustomBookshelfDto);

        expect(error).toBeUndefined();
        expect(dto).toBeInstanceOf(CreateCustomBookShelfDto);
    });

    describe('userId validation', () => {
        test('should throw an error when userId is undefined', () => {
            const dtoObj = {shelfName: 'hello'};
            const [error, dto] = CreateCustomBookShelfDto.create(dtoObj);

            expect(error).toBe(
                BOOK_SHELF_DTO_ERRORS.CREATE_CUSTOM_BOOKSHELF.USER_ID.REQUIRED
            );
            expect(dto).toBeUndefined();
        });
        test('should throw an error when userId is not a number', () => {
            const dtoObj = {
                shelfName: 'hello',
                userId: '1234',
            } as unknown as ICreateCustomBookShelfDto;
            const [error, dto] = CreateCustomBookShelfDto.create(dtoObj);

            expect(error).toBe(
                BOOK_SHELF_DTO_ERRORS.CREATE_CUSTOM_BOOKSHELF.USER_ID.NUMBER
            );
            expect(dto).toBeUndefined();
        });
    });
    describe('shelfName validation', () => {
        test('should throw an error when it is not included', () => {
            const dtoObj = {userId: 12};
            const [error, dto] = CreateCustomBookShelfDto.create(dtoObj);

            expect(error).toBe(
                BOOK_SHELF_DTO_ERRORS.CREATE_CUSTOM_BOOKSHELF.SHELF_NAME.REQUIRED
            );
            expect(dto).toBeUndefined();
        });
        test('should throw an error when it is not a string', () => {
            const dtoObj = {
                shelfName: [],
                userId: 1234,
            } as unknown as ICreateCustomBookShelfDto;
            const [error, dto] = CreateCustomBookShelfDto.create(dtoObj);

            expect(error).toBe(
                BOOK_SHELF_DTO_ERRORS.CREATE_CUSTOM_BOOKSHELF.SHELF_NAME.STRING
            );
            expect(dto).toBeUndefined();
        });
        test('should throw an error when it contains only blank spaces', () => {
            const dtoObj = {...createCustomBookshelfDto, shelfName: '    '};
            const [error, dto] = CreateCustomBookShelfDto.create(dtoObj);

            expect(error).toBe(
                BOOK_SHELF_DTO_ERRORS.CREATE_CUSTOM_BOOKSHELF.SHELF_NAME.BLANK_SPACES
            );
            expect(dto).toBeUndefined();
        });
        test('should throw an error when shelfName length is less than two characters long', () => {
            const dtoObj = {...createCustomBookshelfDto, shelfName: 'a'};
            const [error, dto] = CreateCustomBookShelfDto.create(dtoObj);

            expect(error).toBe(
                BOOK_SHELF_DTO_ERRORS.CREATE_CUSTOM_BOOKSHELF.SHELF_NAME.MIN_LENGTH
            );
            expect(dto).toBeUndefined();
        });
        test('should throw an error when shelfName length is more than 90 characters long', () => {
            const dtoObj = {
                ...createCustomBookshelfDto,
                shelfName: 'Bookshelf'.repeat(90),
            };
            const [error, dto] = CreateCustomBookShelfDto.create(dtoObj);

            expect(error).toBe(
                BOOK_SHELF_DTO_ERRORS.CREATE_CUSTOM_BOOKSHELF.SHELF_NAME.MAX_LENGTH
            );
            expect(dto).toBeUndefined();
        });
    });
});
