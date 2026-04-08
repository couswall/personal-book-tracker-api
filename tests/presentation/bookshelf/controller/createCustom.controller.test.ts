import {Request, Response} from 'express';
import {prisma} from '@data/postgres';
import {createBookshelfControllerSetup} from '@tests/presentation/bookshelf/controller/setup';
import {bookshelfPrisma, createCustomBookshelfDto, mockUserPrisma} from '@tests/fixtures';
import {ERROR_MESSAGES} from '@infrastructure/constants';

jest.mock('@data/postgres', () => ({
    prisma: {
        user: {findFirst: jest.fn()},
        bookshelf: {
            create: jest.fn(),
            findFirst: jest.fn(),
        },
    },
}));

describe('controller - createCustom()', () => {
    const {controller, mockRequest, mockResponse} = createBookshelfControllerSetup();

    beforeEach(() => {
        jest.clearAllMocks();
        jest.restoreAllMocks();
    });

    test('should return a 201 status and bookshelf data when created successfully', async () => {
        mockRequest.body = {...createCustomBookshelfDto};

        (prisma.user.findFirst as jest.Mock).mockResolvedValue(mockUserPrisma);
        (prisma.bookshelf.findFirst as jest.Mock).mockResolvedValue(null);
        (prisma.bookshelf.create as jest.Mock).mockResolvedValue(bookshelfPrisma);

        await new Promise<void>((resolve) => {
            controller.createCustom(mockRequest as Request, mockResponse as Response);
            setImmediate(resolve);
        });

        expect(mockResponse.status).toHaveBeenCalledWith(201);
        expect(mockResponse.json).toHaveBeenCalledWith({
            success: true,
            message: expect.any(String),
            data: expect.objectContaining({
                id: expect.any(Number),
                name: expect.any(String),
            }),
        });
    });

    test('should throw a 400 error when request body is empty', () => {
        mockRequest.body = {};

        controller.createCustom(mockRequest as Request, mockResponse as Response);

        expect(mockResponse.status).toHaveBeenCalledWith(400);
        expect(mockResponse.json).toHaveBeenCalledWith({
            success: false,
            error: expect.any(Object),
        });
    });

    test('should throw a 400 error if user with provided ID does not exist', async () => {
        mockRequest.body = {...createCustomBookshelfDto};

        (prisma.user.findFirst as jest.Mock).mockResolvedValue(null);

        await new Promise<void>((resolve) => {
            controller.createCustom(mockRequest as Request, mockResponse as Response);
            setImmediate(resolve);
        });

        expect(mockResponse.status).toHaveBeenCalledWith(400);
        expect(mockResponse.json).toHaveBeenCalledWith({
            success: false,
            error: {message: ERROR_MESSAGES.USER.GET_BY_ID.NO_EXISTING},
        });
    });

    test('should throw a 400 error if bookshelf with provided name already exists', async () => {
        mockRequest.body = {...createCustomBookshelfDto};

        (prisma.user.findFirst as jest.Mock).mockResolvedValue(mockUserPrisma);
        (prisma.bookshelf.findFirst as jest.Mock).mockResolvedValue(bookshelfPrisma);

        await new Promise<void>((resolve) => {
            controller.createCustom(mockRequest as Request, mockResponse as Response);
            setImmediate(resolve);
        });

        expect(mockResponse.status).toHaveBeenCalledWith(400);
        expect(mockResponse.json).toHaveBeenCalledWith({
            success: false,
            error: {message: ERROR_MESSAGES.BOOKSHELF.CREATE_CUSTOM.EXISTING},
        });
    });
});
