import {BookRepository} from '@domain/repositories/book.repository';
import {BookshelfRepository} from '@domain/repositories/bookshelf.repository';
import {BookshelfBookRepository} from '@domain/repositories/bookshelfBook.repository';
import {ReadingSessionRepository} from '@domain/repositories/readingSession.repository';

export interface IUseCaseMockRepositories {
    mockBookshelfBookRepository: jest.Mocked<BookshelfBookRepository>;
    mockBookRepository: jest.Mocked<BookRepository>;
    mockBookshelfRepository: jest.Mocked<BookshelfRepository>;
    mockReadingSessionRepository: jest.Mocked<ReadingSessionRepository>;
}

export const getMockRepositories = (): IUseCaseMockRepositories => {
    const mockBookshelfBookRepository: jest.Mocked<BookshelfBookRepository> = {
        addToBookshelf: jest.fn(),
        updateBookshelf: jest.fn(),
        removeFromBookshelf: jest.fn(),
    };
    const mockBookRepository: jest.Mocked<BookRepository> = {
        search: jest.fn(),
        getBookById: jest.fn(),
        fetchByIdFromAPI: jest.fn(),
        create: jest.fn(),
        findOrCreateByApiId: jest.fn(),
    };
    const mockBookshelfRepository: jest.Mocked<BookshelfRepository> = {
        getMyBookshelves: jest.fn(),
        getBookshelfById: jest.fn(),
        getBookshelvesWithStatus: jest.fn(),
    };
    const mockReadingSessionRepository: jest.Mocked<ReadingSessionRepository> = {
        findOpenSession: jest.fn(),
        createSession: jest.fn(),
    };

    return {
        mockBookshelfBookRepository,
        mockBookRepository,
        mockBookshelfRepository,
        mockReadingSessionRepository,
    };
};
