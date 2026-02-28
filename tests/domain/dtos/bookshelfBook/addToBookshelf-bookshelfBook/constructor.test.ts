import { AddToBookshelfDto } from "@domain/dtos";

describe('AddToBookshelfDto constructor tests', () => {
    test('should create instance with correct properties', () => {
        const dto = new AddToBookshelfDto(
            5,
            'apiBookId123',
            123,
            300,
            'reading'
        );

        expect(dto).toBeInstanceOf(AddToBookshelfDto);
        expect(dto.bookshelfId).toBe(5);
        expect(dto.apiBookId).toBe('apiBookId123');
        expect(dto.bookId).toBe(123);
        expect(dto.totalPages).toBe(300);
        expect(dto.bookshelfType).toBe('reading');
    });

    test('should create instance with undefined optional properties', () => {
        const dto = new AddToBookshelfDto(5, 'apiBookId123');

        expect(dto.bookId).toBeUndefined();
        expect(dto.totalPages).toBeUndefined();
        expect(dto.bookshelfType).toBeUndefined();  
    });

    test('should create instance with null totalPages', () => {
        const dto = new AddToBookshelfDto(5, 'apiBookId123', undefined, null);

        expect(dto.totalPages).toBeNull();
    });
});