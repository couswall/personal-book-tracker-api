import { Request, Response } from "express";
import { createBookControllerSetup } from "@tests/presentation/book/controller/setup"
import { searchAPIResponseObj, searchBookDtoObj } from "@tests/fixtures";

describe('BookController.searchBook tests', () => {
    const {bookController, mockHttpAdapter, mockRequest, mockResponse} = createBookControllerSetup();
    const searchQueries = {
        ...searchBookDtoObj, 
        page: searchBookDtoObj.page?.toString(),
        maxResults: searchBookDtoObj.maxResults?.toString(),
    };

    test('should return a 200 status and books data when searched successfully', async() => {
        mockRequest.query = searchQueries;

        mockHttpAdapter.get.mockResolvedValue(searchAPIResponseObj);
        
        await new Promise<void>((resolve) => {
            bookController.searchBook(mockRequest as Request, mockResponse as Response);
            setImmediate(resolve);
        });

        expect(mockResponse.status).toHaveBeenCalledWith(200);
        expect(mockResponse.json).toHaveBeenCalledWith({
            success: true,
            message: expect.any(String),
            data: expect.objectContaining({
                page: searchBookDtoObj.page,
                maxResults: searchBookDtoObj.maxResults,
                books: expect.any(Array),
            }),
        });
    });

    test('should throw a 400 error if request query is empty', async () => {
        mockRequest.query = {};

        await bookController.searchBook(mockRequest as Request, mockResponse as Response);

        expect(mockResponse.status).toHaveBeenCalledWith(400);
        expect(mockResponse.json).toHaveBeenCalledWith({
            success: false,
            error: {message: expect.any(String)}
        });
    });

    test('should throw a 500 error when http request fails', async () => {
        mockRequest.query = searchQueries;

        mockHttpAdapter.get.mockRejectedValue(new Error('Network Error'));

        await new Promise<void>((resolve) => {
            bookController.searchBook(mockRequest as Request, mockResponse as Response);
            setImmediate(resolve);
        });

        expect(mockResponse.status).toHaveBeenCalledWith(500);
        expect(mockResponse.json).toHaveBeenCalledWith({
            success: false,
            error: {message: expect.any(String)}
        });
    });
});