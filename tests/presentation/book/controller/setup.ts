import {Request, Response} from 'express';
import {createMockRequest, createMockResponse} from '@tests/setup';
import {BookController} from '@presentation/book/controller';
import {getMockHttpAdapter} from '@tests/setup/httpAdapter.mock';
import {BookDatasourceImpl} from '@infrastructure/datasources/book.datasource.impl';
import {BookRepositoryImpl} from '@infrastructure/repositories/book.repository.impl';
import {HttpClient} from '@config/interfaces';

export interface IBookControllerSetup {
    bookController: BookController;
    mockHttpAdapter: jest.Mocked<HttpClient>;
    mockRequest: Partial<Request>;
    mockResponse: Partial<Response>;
}

export const createBookControllerSetup = (): IBookControllerSetup => {
    const mockHttpAdapter = getMockHttpAdapter();
    const datasource = new BookDatasourceImpl(mockHttpAdapter);
    const repository = new BookRepositoryImpl(datasource);
    const bookController = new BookController(repository);
    let mockRequest = createMockRequest();
    let mockResponse = createMockResponse();

    return {bookController, mockHttpAdapter, mockRequest, mockResponse};
};
