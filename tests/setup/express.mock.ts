import { Request, Response } from "express";

export const createMockRequest = (): Partial<Request> => ({
    body: {},
    params: {},
    query: {},
});

export const createMockResponse = (): Partial<Response> => ({
    status: jest.fn().mockReturnThis(),
    json: jest.fn(),
});
