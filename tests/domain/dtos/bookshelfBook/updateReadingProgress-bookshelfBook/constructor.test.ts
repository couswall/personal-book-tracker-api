import {UpdateReadingProgressDto} from '@domain/dtos';

describe('UpdateReadingProgressDto constructor tests', () => {
    test('should create instance with correct properties', () => {
        const dto = new UpdateReadingProgressDto(1, 'PAGE', 150, true);

        expect(dto).toBeInstanceOf(UpdateReadingProgressDto);
        expect(dto.bookshelfBookId).toBe(1);
        expect(dto.progressType).toBe('PAGE');
        expect(dto.value).toBe(150);
        expect(dto.isFinished).toBe(true);
    });

    test('should default isFinished to false when not provided', () => {
        const dto = new UpdateReadingProgressDto(1, 'PERCENTAGE', 50);

        expect(dto).toBeInstanceOf(UpdateReadingProgressDto);
        expect(dto.isFinished).toBe(false);
    });
});
