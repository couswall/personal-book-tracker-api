import { UpdateBookshelfDto } from "@domain/dtos";
import { updateBookshelfDtoObject } from "@tests/fixtures";
import { INVALID_OBJECT_ERROR } from "@domain/constants/bookshelfBook.constants";
import { IUpdateBookshelfDto } from '@domain/interfaces/bookshelfBook.interfaces';

describe('UpdateBookshelfDto.create() tests', () => {
    test('should return an UpdateBookshelfDto from a valid object', () => {
        const [error, dto] = UpdateBookshelfDto.create(updateBookshelfDtoObject);

        expect(error).toBeUndefined();
        expect(dto).toBeInstanceOf(UpdateBookshelfDto);
        expect(dto?.bookshelfId).toBe(updateBookshelfDtoObject.bookshelfId);
        expect(dto?.bookshelfBookId).toBe(updateBookshelfDtoObject.bookshelfBookId);
        expect(dto?.bookshelfType).toBeUndefined();
    });
    test('should return an UpdateBookshelfDto with all optional fields', () => {
        const [error, dto] = UpdateBookshelfDto.create({
            ...updateBookshelfDtoObject, bookshelfType: undefined
        });

        expect(error).toBeUndefined();
        expect(dto).toBeInstanceOf(UpdateBookshelfDto);
        expect(dto?.bookshelfId).toBe(updateBookshelfDtoObject.bookshelfId);
        expect(dto?.bookshelfBookId).toBe(updateBookshelfDtoObject.bookshelfBookId);
        expect(dto?.bookshelfType).toBeUndefined();
    });
    test('should return an error when dto object is missing', () => {
        const [error, dto] = UpdateBookshelfDto.create(undefined);

        expect(error).toBe(INVALID_OBJECT_ERROR);
        expect(dto).toBeUndefined();
    });

    describe('bookshelfBookId validation', () => {
        test('should return an error when bookshelfBookId is missing', () => {
            const [error, dto] = UpdateBookshelfDto.create({
                ...updateBookshelfDtoObject, bookshelfBookId: undefined
            });

            expect(error).toBe('bookshelfBookId is required');
            expect(dto).toBeUndefined();
        });
        test('should return an error if it is not string or number type', () => {
            const dtoObject = {
                ...updateBookshelfDtoObject, bookshelfBookId: {}
            } as unknown as IUpdateBookshelfDto;

            const [error, dto] = UpdateBookshelfDto.create(dtoObject);

            expect(error).toBe('bookshelfBookId must be a number');
            expect(dto).toBeUndefined();
        });
        test('should return an error when bookshelfBookId is not a numerical string', () => {
            const [error, dto] = UpdateBookshelfDto.create({
                ...updateBookshelfDtoObject, bookshelfBookId: 'abc'
            });

            expect(error).toBe('bookshelfBookId must be a number');
            expect(dto).toBeUndefined();
        });
    });

    describe('bookshelfId validation', () => {
        test('should return an error when bookshelfId is missing', () => {
            const [error, dto] = UpdateBookshelfDto.create({
                ...updateBookshelfDtoObject, bookshelfId: undefined
            });

            expect(error).toBe('bookshelfId is required');
            expect(dto).toBeUndefined();
        });
        test('should return an error if it is not string or number type', () => {
            const dtoObject = {
                ...updateBookshelfDtoObject, bookshelfId: {}
            } as unknown as IUpdateBookshelfDto;

            const [error, dto] = UpdateBookshelfDto.create(dtoObject);

            expect(error).toBe('bookshelfId must be a number');
            expect(dto).toBeUndefined();
        });
        test('should return an error when bookshelfId is not a numerical string', () => {
            const [error, dto] = UpdateBookshelfDto.create({
                ...updateBookshelfDtoObject, bookshelfId: 'abc'
            });

            expect(error).toBe('bookshelfId must be a number');
            expect(dto).toBeUndefined();
        });
    });
});