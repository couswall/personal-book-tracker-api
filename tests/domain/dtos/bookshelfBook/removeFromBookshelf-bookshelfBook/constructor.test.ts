import {RemoveFromBookshelfDto} from '@domain/dtos';

describe('RemoveFromBookshelfDto constructor tests', () => {
    test('should create instance with correct properties', () => {
        const dto = new RemoveFromBookshelfDto(101);

        expect(dto).toBeInstanceOf(RemoveFromBookshelfDto);
        expect(dto.bookshelfBookId).toBe(101);
    });
});
