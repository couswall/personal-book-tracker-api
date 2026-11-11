import {Request, Response} from 'express';

export const createMockRequest = (): Partial<Request> => ({
    body: {},
    params: {},
    query: {},
    cookies: {},
});

export const createMockResponse = (): Partial<Response> => ({
    status: jest.fn().mockReturnThis(),
    json: jest.fn(),
    cookie: jest.fn().mockReturnThis(),
    clearCookie: jest.fn().mockReturnThis(),
});
