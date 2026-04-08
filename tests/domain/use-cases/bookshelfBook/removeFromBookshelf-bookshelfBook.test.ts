import {RemoveFromBookshelfDto} from '@domain/dtos';
import {BookshelfBookEntity} from '@domain/entities';
import {RemoveFromBookshelf} from '@domain/use-cases';
import {getMockRepositories} from '@tests/domain/use-cases/setup';
import {bookshelfBookEntity, removeFromBookshelfDtoObject} from '@tests/fixtures';

describe('removeFromBookshelf-bookshelfBook use case', () => {
    const {mockBookshelfBookRepository} = getMockRepositories();

    beforeEach(() => {
        jest.clearAllMocks();
    });

    test('execute() should return a BookshelfBookEntity instance', async () => {
        const [, dto] = RemoveFromBookshelfDto.create(removeFromBookshelfDtoObject);
        mockBookshelfBookRepository.removeFromBookshelf.mockResolvedValue(
            bookshelfBookEntity
        );

        const result = await new RemoveFromBookshelf(mockBookshelfBookRepository).execute(
            dto as RemoveFromBookshelfDto
        );

        expect(result).toBeInstanceOf(BookshelfBookEntity);
        expect(mockBookshelfBookRepository.removeFromBookshelf).toHaveBeenCalledWith(dto);
    });

    test('execute() should propagate errors from the repository', async () => {
        const [, dto] = RemoveFromBookshelfDto.create(removeFromBookshelfDtoObject);
        mockBookshelfBookRepository.removeFromBookshelf.mockRejectedValue(
            new Error('DB error')
        );

        await expect(
            new RemoveFromBookshelf(mockBookshelfBookRepository).execute(
                dto as RemoveFromBookshelfDto
            )
        ).rejects.toThrow('DB error');
    });
});
