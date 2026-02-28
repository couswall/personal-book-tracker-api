import {NextFunction, Request, Response} from 'express';
import {prisma} from '@data/postgres';
import {JwtAdapter} from '@config/jwt.adapter';
import {validateJWT} from '@presentation/middlewares/validate-jwt';
import {CustomError} from '@domain/errors/custom.error';
import {ERROR_MESSAGES} from '@infrastructure/constants';
import {mockUserPrisma} from '@tests/fixtures';

jest.mock('@config/jwt.adapter', () => ({
    JwtAdapter: {
        validateToken: jest.fn(),
    },
}));

jest.mock('@data/postgres', () => ({
    prisma: {
        user: {
            findFirst: jest.fn(),
        },
    },
}));

describe('validate-jwt middleware test', () => {
    const mockResponse: Partial<Response> = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
    };
    const mockRequest: Partial<Request> = {
        header: jest.fn(),
    };

    const mockNextFn: NextFunction = jest.fn();
    const mockPayload = {id: 1, username: 'test', email: 'any-email@google.com'};

    beforeEach(() => jest.clearAllMocks());

    test('should call next() when token is valid', async () => {
        (mockRequest.header as jest.Mock).mockReturnValue('Bearer any-token');
        (JwtAdapter.validateToken as jest.Mock).mockResolvedValue(mockPayload);
        (prisma.user.findFirst as jest.Mock).mockResolvedValue(mockUserPrisma);

        await validateJWT(mockRequest as Request, mockResponse as Response, mockNextFn);

        expect(mockNextFn).toHaveBeenCalled();
        expect(prisma.user.findFirst).toHaveBeenCalledWith({
            where: {id: mockPayload.id, deletedAt: null},
        });
    });

    test('should throw a 401 error when token is not provided', async () => {
        (mockRequest.header as jest.Mock).mockReturnValue(undefined);

        await validateJWT(mockRequest as Request, mockResponse as Response, mockNextFn);

        expect(mockNextFn).not.toHaveBeenCalled();
        expect(mockResponse.status).toHaveBeenCalledWith(401);
        expect(mockResponse.json).toHaveBeenCalledWith({
            success: false,
            error: {message: ERROR_MESSAGES.TOKEN.NO_TOKEN},
        });
    });

    test('should throw a 401 error when token does not start with Bearer', async () => {
        (mockRequest.header as jest.Mock).mockReturnValue('bearer any-token');

        await validateJWT(mockRequest as Request, mockResponse as Response, mockNextFn);

        expect(mockNextFn).not.toHaveBeenCalled();
        expect(mockResponse.status).toHaveBeenCalledWith(401);
        expect(mockResponse.json).toHaveBeenCalledWith({
            success: false,
            error: {message: ERROR_MESSAGES.TOKEN.NO_TOKEN},
        });
    });

    test('should throw a 401 error if token starts with Bearer, but there is not token', async () => {
        (mockRequest.header as jest.Mock).mockReturnValue('Bearer');

        await validateJWT(mockRequest as Request, mockResponse as Response, mockNextFn);

        expect(mockNextFn).not.toHaveBeenCalled();
        expect(mockResponse.status).toHaveBeenCalledWith(401);
        expect(mockResponse.json).toHaveBeenCalledWith({
            success: false,
            error: {message: ERROR_MESSAGES.TOKEN.NO_TOKEN},
        });
    });

    test('should throw a 401 error when payload is invalid', async () => {
        (mockRequest.header as jest.Mock).mockReturnValue('Bearer any-token');
        (JwtAdapter.validateToken as jest.Mock).mockRejectedValue(
            CustomError.unauthorized(ERROR_MESSAGES.TOKEN.INVALID)
        );

        await validateJWT(mockRequest as Request, mockResponse as Response, mockNextFn);

        expect(mockNextFn).not.toHaveBeenCalled();
        expect(mockResponse.status).toHaveBeenCalledWith(401);
        expect(mockResponse.json).toHaveBeenCalledWith({
            success: false,
            error: {message: ERROR_MESSAGES.TOKEN.INVALID},
        });
    });

    test('should throw a 401 error when prisma user is not found', async () => {
        (mockRequest.header as jest.Mock).mockReturnValue('Bearer any-token');
        (JwtAdapter.validateToken as jest.Mock).mockResolvedValue(mockPayload);
        (prisma.user.findFirst as jest.Mock).mockResolvedValue(null);

        await validateJWT(mockRequest as Request, mockResponse as Response, mockNextFn);

        expect(mockNextFn).not.toHaveBeenCalled();
        expect(mockResponse.status).toHaveBeenCalledWith(401);
        expect(mockResponse.json).toHaveBeenCalledWith({
            success: false,
            error: {message: ERROR_MESSAGES.TOKEN.INVALID_USER},
        });
    });
});
