import {Request, Response} from 'express';
import {readingChallengeObject} from '@tests/fixtures';
import {createMockRequest, createMockResponse} from '@tests/setup';
import {ReadingChallengeDatasourceImpl} from '@infrastructure/datasources/readingChallenge.datasource.impl';
import {ReadingChallengeRepositoryImpl} from '@infrastructure/repositories/readingChallenge.repository.impl';
import {ReadingChallengeController} from '@presentation/readingChallenge/controller';

export const AUTH_USER_ID = readingChallengeObject.userId;
export const CURRENT_YEAR = new Date().getUTCFullYear();

interface IReadingChallengeControllerSetup {
    controller: ReadingChallengeController;
    mockRequest: Partial<Request>;
    mockResponse: Partial<Response>;
}

export const createReadingChallengeControllerSetup =
    (): IReadingChallengeControllerSetup => {
        const controller = new ReadingChallengeController(
            new ReadingChallengeRepositoryImpl(new ReadingChallengeDatasourceImpl())
        );
        const mockRequest = createMockRequest();
        const mockResponse = createMockResponse();
        mockResponse.locals = {userId: AUTH_USER_ID};

        return {controller, mockRequest, mockResponse};
    };
