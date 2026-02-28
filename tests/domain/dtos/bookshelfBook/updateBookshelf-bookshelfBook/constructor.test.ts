import { UpdateBookshelfDto } from "@domain/dtos";

describe('UpdateBookshelfDto constructor tests', () => {
    test('should create instance with correct properties', () => {
        const dto = new UpdateBookshelfDto(1,1,'CUSTOM');

        expect(dto).toBeInstanceOf(UpdateBookshelfDto);
        expect(dto.bookshelfId).toBe(1);
        expect(dto.bookshelfBookId).toBe(1);
        expect(dto.bookshelfType).toBe('CUSTOM');
    });

    test('should create instance with undefined optional properties', () => {
        const dto = new UpdateBookshelfDto(1,1);

        expect(dto).toBeInstanceOf(UpdateBookshelfDto);
        expect(dto.bookshelfId).toBe(1);
        expect(dto.bookshelfBookId).toBe(1);  
    });
});