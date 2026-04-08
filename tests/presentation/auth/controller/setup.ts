import {Request, Response} from 'express';
import {createMockRequest, createMockResponse} from '@tests/setup';
import {AuthController} from '@presentation/auth/controller';
import {UserDatasourceImpl} from '@infrastructure/datasources/user.datasource.impl';
import {UserRepositoryImpl} from '@infrastructure/repositories/user.repository.impl';

export interface IAuthControllerSetup {
    authController: AuthController;
    mockRequest: Partial<Request>;
    mockResponse: Partial<Response>;
}

export const createAuthControllerSetup = (): IAuthControllerSetup => {
    const datasource = new UserDatasourceImpl();
    const repository = new UserRepositoryImpl(datasource);
    const authController = new AuthController(repository);
    const mockRequest = createMockRequest();
    const mockResponse = createMockResponse();

    return {authController, mockRequest, mockResponse};
};
