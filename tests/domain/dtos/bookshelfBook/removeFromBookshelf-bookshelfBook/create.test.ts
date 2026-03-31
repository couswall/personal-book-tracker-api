import {RemoveFromBookshelfDto} from '@domain/dtos';
import {removeFromBookshelfDtoObject} from '@tests/fixtures';
import {INVALID_OBJECT_ERROR} from '@domain/constants/bookshelfBook.constants';
import {IRemoveFromBookshelfDto} from '@domain/interfaces/bookshelfBook.interfaces';

describe('RemoveFromBookshelfDto.create() tests', () => {
    test('should return a RemoveFromBookshelfDto from a valid object', () => {
        const [error, dto] = RemoveFromBookshelfDto.create(removeFromBookshelfDtoObject);

        expect(error).toBeUndefined();
        expect(dto).toBeInstanceOf(RemoveFromBookshelfDto);
        expect(dto?.bookshelfBookId).toBe(removeFromBookshelfDtoObject.bookshelfBookId);
    });

    test('should return an error when dto object is missing', () => {
        const [error, dto] = RemoveFromBookshelfDto.create(undefined);

        expect(error).toBe(INVALID_OBJECT_ERROR);
        expect(dto).toBeUndefined();
    });

    describe('bookshelfBookId validation', () => {
        test('should return an error when bookshelfBookId is missing', () => {
            const [error, dto] = RemoveFromBookshelfDto.create({});

            expect(error).toBe('bookshelfBookId is required');
            expect(dto).toBeUndefined();
        });

        test('should return an error if it is not a string or number type', () => {
            const dtoObject = {bookshelfBookId: {}} as unknown as IRemoveFromBookshelfDto;
            const [error, dto] = RemoveFromBookshelfDto.create(dtoObject);

            expect(error).toBe('bookshelfBookId must be a number');
            expect(dto).toBeUndefined();
        });

        test('should return an error when bookshelfBookId is a non-numerical string', () => {
            const [error, dto] = RemoveFromBookshelfDto.create({bookshelfBookId: 'abc'});

            expect(error).toBe('bookshelfBookId must be a number');
            expect(dto).toBeUndefined();
        });

        test('should coerce bookshelfBookId from a numerical string', () => {
            const [error, dto] = RemoveFromBookshelfDto.create({bookshelfBookId: '101'});

            expect(error).toBeUndefined();
            expect(dto?.bookshelfBookId).toBe(101);
        });
    });
});
