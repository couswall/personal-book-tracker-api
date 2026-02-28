import {BookRepository} from '@domain/repositories/book.repository';
import {BookshelfRepository} from '@domain/repositories/bookshelf.repository';
import {BookshelfBookRepository} from '@domain/repositories/bookshelfBook.repository';

export interface IUseCaseMockRepositories {
    mockBookshelfBookRepository: jest.Mocked<BookshelfBookRepository>;
    mockBookRepository: jest.Mocked<BookRepository>;
    mockBookshelfRepository: jest.Mocked<BookshelfRepository>;
}

export const getMockRepositories = (): IUseCaseMockRepositories => {
    const mockBookshelfBookRepository: jest.Mocked<BookshelfBookRepository> = {
        addToBookshelf: jest.fn(),
        updateBookshelf: jest.fn(),
    };
    const mockBookRepository: jest.Mocked<BookRepository> = {
        search: jest.fn(),
        getBookById: jest.fn(),
        fetchByIdFromAPI: jest.fn(),
        create: jest.fn(),
        findOrCreateByApiId: jest.fn(),
    };
    const mockBookshelfRepository: jest.Mocked<BookshelfRepository> = {
        createCustom: jest.fn(),
        getMyBookshelves: jest.fn(),
        getBookshelfById: jest.fn(),
    };

    return {
        mockBookshelfBookRepository,
        mockBookRepository,
        mockBookshelfRepository,
    };
};
