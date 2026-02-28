import {Request, Response} from 'express';
import {createMockRequest, createMockResponse, getMockHttpAdapter} from '@tests/setup';
import {BookshelfBookController} from '@presentation/bookshelfBook/controller';
import {BookshelfBookRepositoryImpl} from '@infrastructure/repositories/bookshelfBook.repository.impl';
import {BookshelfBookDatasourceImpl} from '@infrastructure/datasources/bookshelfBook.datasource.impl';
import {BookRepositoryImpl} from '@infrastructure/repositories/book.repository.impl';
import {BookDatasourceImpl} from '@infrastructure/datasources/book.datasource.impl';
import {BookshelfRepositoryImpl} from '@infrastructure/repositories/bookshelf.repository.impl';
import {BookshelfDatasourceImpl} from '@infrastructure/datasources/bookshelf.datasource.impl';
import {HttpClient} from '@config/interfaces';

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
    const controller = new BookshelfBookController(
        repository,
        bookRepository,
        bookshelfRepository
    );
    let mockRequest = createMockRequest();
    let mockResponse = createMockResponse();

    return {
        controller,
        mockHttpAdapter,
        mockRequest,
        mockResponse,
    };
};
