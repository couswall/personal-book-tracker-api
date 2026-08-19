import {BookshelfType} from '@/generated/prisma';
import {ERROR_MESSAGES} from '@infrastructure/constants';
import {UpdateBookshelfDto} from '@domain/dtos';
import {BookshelfBookEntity} from '@domain/entities';
import {CustomError} from '@domain/errors/custom.error';
import {UpdateBookshelf} from '@domain/use-cases/bookshelfBook/updateBookshelf-bookshelfBook';
import {getMockRepositories} from '@tests/domain/use-cases/setup';
import {
    bookshelfBookEntity,
    bookshelfEntity,
    readingSessionEntity,
} from '@tests/fixtures';

describe('updateBookshelf-bookshelfBook use case tests', () => {
    const {
        mockBookRepository,
        mockBookshelfBookRepository,
        mockBookshelfRepository,
        mockReadingSessionRepository,
    } = getMockRepositories();

    const buildUseCase = () =>
        new UpdateBookshelf(
            mockBookshelfBookRepository,
            mockBookRepository,
            mockBookshelfRepository,
            mockReadingSessionRepository
        );

    beforeEach(() => {
        jest.clearAllMocks();
    });

    test('execute() should return a BookshelfBookEntity instance', async () => {
        const dto = new UpdateBookshelfDto(1, 1);
        mockBookshelfRepository.getBookshelfById.mockResolvedValue(bookshelfEntity);
        mockBookshelfBookRepository.updateBookshelf.mockResolvedValue(
            bookshelfBookEntity
        );

        const result = await buildUseCase().execute(dto);

        expect(result).toBeInstanceOf(BookshelfBookEntity);
        expect(mockBookshelfRepository.getBookshelfById).toHaveBeenCalledWith(1);
        expect(dto.bookshelfType).toBe(bookshelfEntity.type);
    });

    test('execute() should thorw an error when bookshelf with provided ID does not exist', async () => {
        const dto = new UpdateBookshelfDto(1, 1);

        mockBookshelfRepository.getBookshelfById.mockRejectedValue(
            CustomError.badRequest(ERROR_MESSAGES.BOOKSHELF.GET_BOOKSHELF_BY_ID.NOT_FOUND)
        );

        await expect(buildUseCase().execute(dto)).rejects.toThrow(
            CustomError.badRequest(ERROR_MESSAGES.BOOKSHELF.GET_BOOKSHELF_BY_ID.NOT_FOUND)
        );

        expect(mockBookshelfBookRepository.updateBookshelf).not.toHaveBeenCalled();
    });

    test('execute() should not touch reading sessions when the target shelf is not CURRENTLY_READING or READ', async () => {
        const dto = new UpdateBookshelfDto(1, 1);
        mockBookshelfRepository.getBookshelfById.mockResolvedValue(bookshelfEntity);
        mockBookshelfBookRepository.updateBookshelf.mockResolvedValue(
            bookshelfBookEntity
        );

        await buildUseCase().execute(dto);

        expect(mockReadingSessionRepository.findOpenSession).not.toHaveBeenCalled();
        expect(mockReadingSessionRepository.createSession).not.toHaveBeenCalled();
        expect(mockReadingSessionRepository.finishSession).not.toHaveBeenCalled();
    });

    test('execute() should create a reading session when moved to CURRENTLY_READING and no open session exists', async () => {
        const dto = new UpdateBookshelfDto(1, 1);
        const currentlyReadingBookshelf = {
            ...bookshelfEntity,
            type: BookshelfType.CURRENTLY_READING,
        };
        mockBookshelfRepository.getBookshelfById.mockResolvedValue(
            currentlyReadingBookshelf
        );
        mockBookshelfBookRepository.updateBookshelf.mockResolvedValue(
            bookshelfBookEntity
        );
        mockReadingSessionRepository.findOpenSession.mockResolvedValue(null);

        await buildUseCase().execute(dto);

        expect(mockReadingSessionRepository.findOpenSession).toHaveBeenCalledWith(
            currentlyReadingBookshelf.userId,
            bookshelfBookEntity.bookId
        );
        expect(mockReadingSessionRepository.createSession).toHaveBeenCalledWith({
            userId: currentlyReadingBookshelf.userId,
            bookId: bookshelfBookEntity.bookId,
            startedAt: expect.any(Date),
            finishedAt: null,
        });
        expect(mockReadingSessionRepository.finishSession).not.toHaveBeenCalled();
    });

    test('execute() should create an already-finished reading session when moved directly to READ and no open session exists', async () => {
        const dto = new UpdateBookshelfDto(1, 1);
        const readBookshelf = {...bookshelfEntity, type: BookshelfType.READ};
        mockBookshelfRepository.getBookshelfById.mockResolvedValue(readBookshelf);
        mockBookshelfBookRepository.updateBookshelf.mockResolvedValue(
            bookshelfBookEntity
        );
        mockReadingSessionRepository.findOpenSession.mockResolvedValue(null);

        await buildUseCase().execute(dto);

        expect(mockReadingSessionRepository.createSession).toHaveBeenCalledWith({
            userId: readBookshelf.userId,
            bookId: bookshelfBookEntity.bookId,
            startedAt: expect.any(Date),
            finishedAt: expect.any(Date),
        });
        expect(mockReadingSessionRepository.finishSession).not.toHaveBeenCalled();
    });

    test('execute() should not create a new reading session when an open one already exists', async () => {
        const dto = new UpdateBookshelfDto(1, 1);
        const currentlyReadingBookshelf = {
            ...bookshelfEntity,
            type: BookshelfType.CURRENTLY_READING,
        };
        mockBookshelfRepository.getBookshelfById.mockResolvedValue(
            currentlyReadingBookshelf
        );
        mockBookshelfBookRepository.updateBookshelf.mockResolvedValue(
            bookshelfBookEntity
        );
        mockReadingSessionRepository.findOpenSession.mockResolvedValue(
            readingSessionEntity
        );

        await buildUseCase().execute(dto);

        expect(mockReadingSessionRepository.createSession).not.toHaveBeenCalled();
        expect(mockReadingSessionRepository.finishSession).not.toHaveBeenCalled();
    });

    test('execute() should finish the existing open session when moved to READ', async () => {
        const dto = new UpdateBookshelfDto(1, 1);
        const readBookshelf = {...bookshelfEntity, type: BookshelfType.READ};
        mockBookshelfRepository.getBookshelfById.mockResolvedValue(readBookshelf);
        mockBookshelfBookRepository.updateBookshelf.mockResolvedValue(
            bookshelfBookEntity
        );
        mockReadingSessionRepository.findOpenSession.mockResolvedValue(
            readingSessionEntity
        );

        await buildUseCase().execute(dto);

        expect(mockReadingSessionRepository.finishSession).toHaveBeenCalledWith(
            readingSessionEntity.id
        );
        expect(mockReadingSessionRepository.createSession).not.toHaveBeenCalled();
    });
});
