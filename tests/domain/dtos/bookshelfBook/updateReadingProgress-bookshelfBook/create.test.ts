import {UpdateReadingProgressDto} from '@domain/dtos';
import {updateReadingProgressDtoObject} from '@tests/fixtures';
import {INVALID_OBJECT_ERROR} from '@domain/constants/bookshelfBook.constants';
import {IUpdateReadingProgressDto} from '@domain/interfaces/bookshelfBook.interfaces';

describe('UpdateReadingProgressDto.create() tests', () => {
    test('should return an UpdateReadingProgressDto from a valid object', () => {
        const [error, dto] = UpdateReadingProgressDto.create(
            updateReadingProgressDtoObject
        );

        expect(error).toBeUndefined();
        expect(dto).toBeInstanceOf(UpdateReadingProgressDto);
        expect(dto?.bookshelfBookId).toBe(updateReadingProgressDtoObject.bookshelfBookId);
        expect(dto?.progressType).toBe(updateReadingProgressDtoObject.progressType);
        expect(dto?.value).toBe(updateReadingProgressDtoObject.value);
        expect(dto?.isFinished).toBe(false);
    });

    test('should default isFinished to false when omitted', () => {
        const [error, dto] = UpdateReadingProgressDto.create({
            ...updateReadingProgressDtoObject,
            isFinished: undefined,
        });

        expect(error).toBeUndefined();
        expect(dto?.isFinished).toBe(false);
    });

    test('should return an error when dto object is missing', () => {
        const [error, dto] = UpdateReadingProgressDto.create(undefined);

        expect(error).toBe(INVALID_OBJECT_ERROR);
        expect(dto).toBeUndefined();
    });

    describe('bookshelfBookId validation', () => {
        test('should return an error when bookshelfBookId is missing', () => {
            const [error, dto] = UpdateReadingProgressDto.create({
                ...updateReadingProgressDtoObject,
                bookshelfBookId: undefined,
            });

            expect(error).toBe('bookshelfBookId is required');
            expect(dto).toBeUndefined();
        });

        test('should return an error when bookshelfBookId is not a numerical string', () => {
            const [error, dto] = UpdateReadingProgressDto.create({
                ...updateReadingProgressDtoObject,
                bookshelfBookId: 'abc',
            });

            expect(error).toBe('bookshelfBookId must be a number');
            expect(dto).toBeUndefined();
        });
    });

    describe('progressType validation', () => {
        test('should return an error when progressType is missing', () => {
            const [error, dto] = UpdateReadingProgressDto.create({
                ...updateReadingProgressDtoObject,
                progressType: undefined,
            });

            expect(error).toBe('progressType is required');
            expect(dto).toBeUndefined();
        });

        test('should return an error when progressType is not PAGE or PERCENTAGE', () => {
            const [error, dto] = UpdateReadingProgressDto.create({
                ...updateReadingProgressDtoObject,
                progressType: 'CHAPTER',
            });

            expect(error).toBe('progressType must be either PAGE or PERCENTAGE');
            expect(dto).toBeUndefined();
        });

        test('should accept PERCENTAGE as a valid progressType', () => {
            const [error, dto] = UpdateReadingProgressDto.create({
                ...updateReadingProgressDtoObject,
                progressType: 'PERCENTAGE',
            });

            expect(error).toBeUndefined();
            expect(dto?.progressType).toBe('PERCENTAGE');
        });
    });

    describe('value validation', () => {
        test('should return an error when value is missing', () => {
            const [error, dto] = UpdateReadingProgressDto.create({
                ...updateReadingProgressDtoObject,
                value: undefined,
            });

            expect(error).toBe('value is required');
            expect(dto).toBeUndefined();
        });

        test('should return an error when value is not a numerical string', () => {
            const [error, dto] = UpdateReadingProgressDto.create({
                ...updateReadingProgressDtoObject,
                value: 'abc',
            });

            expect(error).toBe('value must be a number');
            expect(dto).toBeUndefined();
        });
    });

    describe('isFinished validation', () => {
        test('should return an error when isFinished is not a boolean', () => {
            const dtoObject = {
                ...updateReadingProgressDtoObject,
                isFinished: 'true',
            } as unknown as IUpdateReadingProgressDto;

            const [error, dto] = UpdateReadingProgressDto.create(dtoObject);

            expect(error).toBe('isFinished must be a boolean');
            expect(dto).toBeUndefined();
        });

        test('should accept isFinished when true', () => {
            const [error, dto] = UpdateReadingProgressDto.create({
                ...updateReadingProgressDtoObject,
                isFinished: true,
            });

            expect(error).toBeUndefined();
            expect(dto?.isFinished).toBe(true);
        });
    });
});
