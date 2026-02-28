import {prisma} from '@data/postgres';
import {BCryptAdapter} from '@config/bcrypt.adapter';
import {UserDatasourceImpl} from '@infrastructure/datasources/user.datasource.impl';
import {UserEntity} from '@domain/entities/user.entity';
import {CreateUserDto, GetUserByIdDto, LoginUserDto} from '@domain/dtos';
import {ERROR_MESSAGES} from '@infrastructure/constants';
import {
    createUserDtoObj,
    loginUserDtoObj,
    mockUserPrisma,
    userObj,
} from '@tests/fixtures';

jest.mock('@data/postgres', () => ({
    prisma: {
        user: {
            findFirst: jest.fn(),
            create: jest.fn(),
        },
        bookshelf: {
            createMany: jest.fn(),
        },
    },
}));

jest.mock('@config/bcrypt.adapter', () => ({
    BCryptAdapter: {
        compare: jest.fn(),
    },
}));

describe('user.datasource.impl tests', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    const userDatasourceImpl = new UserDatasourceImpl();

    describe('create()', () => {
        test('should return UserEntity when created successfully', async () => {
            const [, dto] = CreateUserDto.create(createUserDtoObj);

            (prisma.user.findFirst as jest.Mock).mockResolvedValue(null);
            (prisma.user.create as jest.Mock).mockResolvedValue(mockUserPrisma);

            const result = await userDatasourceImpl.create(dto!);

            expect(result).toBeInstanceOf(UserEntity);
            expect(prisma.user.create).toHaveBeenCalled();
            expect(prisma.bookshelf.createMany).toHaveBeenCalled();
        });
        test('should throw an error if username already exists', async () => {
            const [, dto] = CreateUserDto.create(createUserDtoObj);

            (prisma.user.findFirst as jest.Mock)
                .mockResolvedValueOnce(mockUserPrisma)
                .mockResolvedValue(null);

            await expect(userDatasourceImpl.create(dto!)).rejects.toThrow(
                ERROR_MESSAGES.USER.CREATE.EXISTING_USERNAME
            );
        });
        test('should throw an error if email already exists', async () => {
            const [, dto] = CreateUserDto.create(createUserDtoObj);

            (prisma.user.findFirst as jest.Mock)
                .mockResolvedValueOnce(null)
                .mockResolvedValue(mockUserPrisma);

            await expect(userDatasourceImpl.create(dto!)).rejects.toThrow(
                ERROR_MESSAGES.USER.CREATE.EXISTING_EMAIL
            );
        });
    });
    describe('login()', () => {
        test('should return UserEntity if login succeeds', async () => {
            const [, dto] = LoginUserDto.create(loginUserDtoObj);

            (prisma.user.findFirst as jest.Mock).mockResolvedValue(mockUserPrisma);
            (BCryptAdapter.compare as jest.Mock).mockReturnValue(true);

            const result = await userDatasourceImpl.login(dto!);

            expect(result).toBeInstanceOf(UserEntity);
            expect(prisma.user.findFirst).toHaveBeenCalled();
        });
        test('should throw an error if user does not exists', async () => {
            const [, dto] = LoginUserDto.create(loginUserDtoObj);

            (prisma.user.findFirst as jest.Mock).mockResolvedValue(null);

            await expect(userDatasourceImpl.login(dto!)).rejects.toThrow(
                ERROR_MESSAGES.USER.LOGIN.INVALID_CREDENTIALS
            );
        });
        test('should throw an error if password is invalid', async () => {
            const [, dto] = LoginUserDto.create(loginUserDtoObj);

            (prisma.user.findFirst as jest.Mock).mockResolvedValue(mockUserPrisma);
            (BCryptAdapter.compare as jest.Mock).mockReturnValue(false);

            await expect(userDatasourceImpl.login(dto!)).rejects.toThrow(
                ERROR_MESSAGES.USER.LOGIN.INVALID_CREDENTIALS
            );
        });
    });

    describe('getById()', () => {
        test('should return UserEntity if findFirst succeeds', async () => {
            const [, dto] = GetUserByIdDto.create(userObj.id);

            (prisma.user.findFirst as jest.Mock).mockResolvedValue(mockUserPrisma);

            const result = await userDatasourceImpl.getById(dto!);

            expect(result).toBeInstanceOf(UserEntity);
            expect(prisma.user.findFirst).toHaveBeenCalled();
        });
        test('should throw an error when user with provided ID does not exists', async () => {
            const [, dto] = GetUserByIdDto.create(userObj.id);

            (prisma.user.findFirst as jest.Mock).mockResolvedValue(null);

            await expect(userDatasourceImpl.getById(dto!)).rejects.toThrow(
                ERROR_MESSAGES.USER.GET_BY_ID.NO_EXISTING
            );
        });
    });
});
