import {CreateUserDto, GetUserByIdDto, LoginUserDto} from '@domain/dtos';
import {UserEntity} from '@domain/entities/user.entity';
import {UserDatasource} from '@domain/datasources/user.datasource';
import {UserRepositoryImpl} from '@infrastructure/repositories/user.repository.impl';
import {createUserDtoObj, loginUserDtoObj, userEntity, userObj} from '@tests/fixtures';

describe('user.repository.impl tests', () => {
    const mockUserDatasource: jest.Mocked<UserDatasource> = {
        create: jest.fn(),
        login: jest.fn(),
        getById: jest.fn(),
    };

    const userDatasourceImpl = new UserRepositoryImpl(mockUserDatasource);

    test('create() should call datasource.create() and return a UserEntity', async () => {
        const [, dto] = CreateUserDto.create(createUserDtoObj);

        mockUserDatasource.create.mockResolvedValue(userEntity);

        const result = await userDatasourceImpl.create(dto!);

        expect(result).toBeInstanceOf(UserEntity);
        expect(mockUserDatasource.create).toHaveBeenCalledWith(dto!);
    });

    test('login() should call datasource.login() and return a UserEntity', async () => {
        const [, dto] = LoginUserDto.create(loginUserDtoObj);

        mockUserDatasource.login.mockResolvedValue(userEntity);

        const result = await userDatasourceImpl.login(dto!);

        expect(result).toBeInstanceOf(UserEntity);
        expect(mockUserDatasource.login).toHaveBeenCalledWith(dto!);
    });

    test('getById() method should return an UserEntity instance', async () => {
        const [, dto] = GetUserByIdDto.create(userObj.id);

        mockUserDatasource.getById.mockResolvedValue(userEntity);

        const result = await mockUserDatasource.getById(dto!);

        expect(result).toBeInstanceOf(UserEntity);
        expect(mockUserDatasource.getById).toHaveBeenCalledWith(dto);
    });
});
