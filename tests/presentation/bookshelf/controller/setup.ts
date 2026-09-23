import {bookshelfObj} from '@tests/fixtures';
import {Request, Response} from 'express';
import {createMockRequest, createMockResponse} from '@tests/setup';
import {BookshelfDatasourceImpl} from '@infrastructure/datasources/bookshelf.datasource.impl';
import {UserDatasourceImpl} from '@infrastructure/datasources/user.datasource.impl';
import {BookshelfRepositoryImpl} from '@infrastructure/repositories/bookshelf.repository.impl';
import {UserRepositoryImpl} from '@infrastructure/repositories/user.repository.impl';
import {BookshelfController} from '@presentation/bookshelf/controller';

export const AUTH_USER_ID = bookshelfObj.userId;

interface IBookshelfControllerSetup {
    controller: BookshelfController;
    mockRequest: Partial<Request>;
    mockResponse: Partial<Response>;
}

export const createBookshelfControllerSetup = (): IBookshelfControllerSetup => {
    const controller = new BookshelfController(
        new BookshelfRepositoryImpl(new BookshelfDatasourceImpl()),
        new UserRepositoryImpl(new UserDatasourceImpl())
    );
    const mockRequest = createMockRequest();
    const mockResponse = createMockResponse();
    mockResponse.locals = {userId: AUTH_USER_ID};

    return {
        controller,
        mockRequest,
        mockResponse,
    };
};
