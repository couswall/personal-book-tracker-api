import { GetBookByIdDto } from "@/src/domain/dtos";

describe('getBookById-book.dto tests', () => {
    test('should create a GetBookById instance from a valid string', () => {
        const bookId = '12345';
        const [error, dto] = GetBookByIdDto.create(bookId);

        expect(error).toBeUndefined();
        expect(dto).toBeInstanceOf(GetBookByIdDto);
        expect(dto?.bookId).toBe(bookId);
    });
    test('should return an error if bookId is undefined', () => {
        const [error, dto] = GetBookByIdDto.create(undefined);

        expect(error).toContain('is required');
        expect(dto).toBeUndefined();
    });
    test('should return an error if bookId is an empty string', () => {
        const [error, dto] = GetBookByIdDto.create('');

        expect(error).toContain('is required');
        expect(dto).toBeUndefined();
    });
    test('should return an error if bookId length is more than 30 characters', () => {
        const [error, dto] = GetBookByIdDto.create('a'.repeat(31));

        expect(error).toContain('must contain at most 30 characters');
        expect(dto).toBeUndefined();
    });
    test('should return an error if bookId contains only blank spaces', () => {
        const [error, dto] = GetBookByIdDto.create('   ');

        expect(error).toContain('must not contain only blank spaces');
        expect(dto).toBeUndefined();
    });
    test('should return an error if bookId is not a string', () => {
        const [error, dto] = GetBookByIdDto.create(123 as unknown as string);

        expect(error).toContain('must be a string');
        expect(dto).toBeUndefined();
    });
});