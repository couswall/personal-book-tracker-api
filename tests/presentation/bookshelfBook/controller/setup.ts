import {bookshelfObj} from '@tests/fixtures';
import {Request, Response} from 'express';
import {createMockRequest, createMockResponse, getMockHttpAdapter} from '@tests/setup';
import {BookshelfBookController} from '@presentation/bookshelfBook/controller';
import {BookshelfBookRepositoryImpl} from '@infrastructure/repositories/bookshelfBook.repository.impl';
import {BookshelfBookDatasourceImpl} from '@infrastructure/datasources/bookshelfBook/bookshelfBook.datasource.impl';
import {BookRepositoryImpl} from '@infrastructure/repositories/book.repository.impl';
import {BookDatasourceImpl} from '@/src/infrastructure/datasources/book/book.datasource.impl';
import {BookshelfRepositoryImpl} from '@infrastructure/repositories/bookshelf.repository.impl';
import {BookshelfDatasourceImpl} from '@infrastructure/datasources/bookshelf.datasource.impl';
import {ReadingSessionRepositoryImpl} from '@infrastructure/repositories/readingSession.repository.impl';
import {ReadingSessionDatasourceImpl} from '@infrastructure/datasources/readingSession.datasource.impl';
import {HttpClient} from '@config/interfaces';

export const AUTH_USER_ID = bookshelfObj.userId;

export interface IBookshelfBookControllerSetup {
    controller: BookshelfBookController;
    mockHttpAdapter: jest.Mocked<HttpClient>;
    mockRequest: Partial<Request>;
    mockResponse: Partial<Response>;
}

export const createBookshelfBookControllerSetup = (): IBookshelfBookControllerSetup => {
    const mockHttpAdapter = getMockHttpAdapter();
    const bookRepository = new BookRepositoryImpl(
        new BookDatasourceImpl(mockHttpAdapter)
    );
    const bookshelfRepository = new BookshelfRepositoryImpl(
        new BookshelfDatasourceImpl()
    );
    const datasource = new BookshelfBookDatasourceImpl();
    const repository = new BookshelfBookRepositoryImpl(datasource);
    const readingSessionRepository = new ReadingSessionRepositoryImpl(
        new ReadingSessionDatasourceImpl()
    );
    const controller = new BookshelfBookController(
        repository,
        bookRepository,
        bookshelfRepository,
        readingSessionRepository
    );
    const mockRequest = createMockRequest();
    const mockResponse = createMockResponse();
    mockResponse.locals = {userId: AUTH_USER_ID};

    return {
        controller,
        mockHttpAdapter,
        mockRequest,
        mockResponse,
    };
};
