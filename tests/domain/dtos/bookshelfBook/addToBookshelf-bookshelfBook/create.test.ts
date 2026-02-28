import {AddToBookshelfDto} from '@domain/dtos';
import {addToBookshelfDtoObject} from '@tests/fixtures';
import {IAddToBookshelfDto} from '@domain/interfaces/bookshelfBook.interfaces';

describe('AddToBookshelfDto create() tests', () => {
    test('should return an AddToBookshelfDto from a valid object', () => {
        const [error, dto] = AddToBookshelfDto.create(addToBookshelfDtoObject);

        expect(error).toBeUndefined();
        expect(dto).toBeInstanceOf(AddToBookshelfDto);
        expect(dto?.apiBookId).toBe(addToBookshelfDtoObject.apiBookId);
        expect(dto?.bookshelfId).toBe(addToBookshelfDtoObject.bookshelfId);
    });
    test('should return an AddToBookshelfDto with all optional fields', () => {
        const completeObject = {
            ...addToBookshelfDtoObject,
            bookId: 123,
            totalPages: 300,
            bookshelfType: 'reading',
        };

        const [error, dto] = AddToBookshelfDto.create(completeObject);

        expect(error).toBeUndefined();
        expect(dto).toBeInstanceOf(AddToBookshelfDto);
        expect(dto?.apiBookId).toBe(completeObject.apiBookId);
        expect(dto?.bookshelfId).toBe(completeObject.bookshelfId);
        expect(dto?.bookId).toBe(completeObject.bookId);
        expect(dto?.totalPages).toBe(completeObject.totalPages);
        expect(dto?.bookshelfType).toBe(completeObject.bookshelfType);
    });
    test('should return an AddToBookshelfDto with null totalPages', () => {
        const objectWithNullPages = {
            ...addToBookshelfDtoObject,
            totalPages: null,
        };

        const [error, dto] = AddToBookshelfDto.create(objectWithNullPages);

        expect(error).toBeUndefined();
        expect(dto).toBeInstanceOf(AddToBookshelfDto);
        expect(dto?.totalPages).toBeNull();
    });
    test('should trim apiBookId and bookshelfType', () => {
        const objectWithWhitespace: IAddToBookshelfDto = {
            bookshelfId: 5,
            apiBookId: '  api123  ',
            bookshelfType: '  reading  ',
        };

        const [error, dto] = AddToBookshelfDto.create(objectWithWhitespace);

        expect(error).toBeUndefined();
        expect(dto?.apiBookId).toBe('api123');
        expect(dto?.bookshelfType).toBe('reading');
    });
    test('should handle string bookshelfId and convert to number', () => {
        const objectWithStringId: IAddToBookshelfDto = {
            bookshelfId: '5',
            apiBookId: 'apiBookId123',
        };

        const [error, dto] = AddToBookshelfDto.create(objectWithStringId);

        expect(error).toBeUndefined();
        expect(dto?.bookshelfId).toBe(5);
        expect(typeof dto?.bookshelfId).toBe('number');
    });

    test('should handle string bookId and convert to number', () => {
        const objectWithStringBookId: IAddToBookshelfDto = {
            bookshelfId: 5,
            apiBookId: 'apiBookId123',
            bookId: '123' as unknown as number,
        };

        const [error, dto] = AddToBookshelfDto.create(objectWithStringBookId);

        expect(error).toBeUndefined();
        expect(dto?.bookId).toBe(123);
        expect(typeof dto?.bookId).toBe('number');
    });

    describe('bookshelfId validation', () => {
        test('should return an error when bookshelfId is missing', () => {
            const invalidObject = {
                apiBookId: 'apiBookId123',
            } as unknown as IAddToBookshelfDto;
            const [error, dto] = AddToBookshelfDto.create(invalidObject);

            expect(error).toBe('bookshelfId is required');
            expect(dto).toBeUndefined();
        });

        test('should return an error when bookshelfId is not a number', () => {
            const invalidObject: IAddToBookshelfDto = {
                bookshelfId: 'not-a-number',
                apiBookId: 'apiBookId123',
            };

            const [error, dto] = AddToBookshelfDto.create(invalidObject);

            expect(error).toBe('bookshelfId must be a number');
            expect(dto).toBeUndefined();
        });
    });

    describe('apiBookId  validation', () => {
        test('should return an error when apiBookId is missing', () => {
            const invalidObject = {bookshelfId: 5} as unknown as IAddToBookshelfDto;

            const [error, dto] = AddToBookshelfDto.create(invalidObject);

            expect(error).toBe('apiBookId is required');
            expect(dto).toBeUndefined();
        });

        test('should return an error when apiBookId is an empty string', () => {
            const invalidObject: IAddToBookshelfDto = {
                bookshelfId: 5,
                apiBookId: '',
            };

            const [error, dto] = AddToBookshelfDto.create(invalidObject);

            expect(error).toBe('apiBookId is required');
            expect(dto).toBeUndefined();
        });

        test('should return an error when apiBookId is too long', () => {
            const invalidObject = {bookshelfId: 5, apiBookId: 'a'.repeat(16)};

            const [error, dto] = AddToBookshelfDto.create(invalidObject);

            expect(error).toBe('apiBookId must contain at most 15 characters long');
            expect(dto).toBeUndefined();
        });

        test('should return an error when apiBookId contains only whitespace', () => {
            const invalidObject = {bookshelfId: 5, apiBookId: '   '};

            const [error, dto] = AddToBookshelfDto.create(invalidObject);

            expect(error).toBe('apiBookId must not contain only blank spaces');
            expect(dto).toBeUndefined();
        });
    });

    describe('bookId validation', () => {
        test('should return an error when bookId is not a number', () => {
            const invalidObject: IAddToBookshelfDto = {
                bookshelfId: 5,
                apiBookId: 'apiBookId123',
                bookId: 'not-a-number' as unknown as number,
            };

            const [error, dto] = AddToBookshelfDto.create(invalidObject);

            expect(error).toBe('bookId must be a number');
            expect(dto).toBeUndefined();
        });
    });

    describe('bookshelfType validation', () => {
        test('should return an error when bookshelfType is not a string', () => {
            const invalidObject: IAddToBookshelfDto = {
                bookshelfId: 5,
                apiBookId: 'apiBookId123',
                bookshelfType: 123 as unknown as string,
            };

            const [error, dto] = AddToBookshelfDto.create(invalidObject);

            expect(error).toBe('bookshelfType must be a string');
            expect(dto).toBeUndefined();
        });
    });
});
