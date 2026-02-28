import {UserRepository} from '@domain/repositories/user.repository';
import {CreateUserDto, GetUserByIdDto, LoginUserDto} from '@domain/dtos';
import {UserEntity} from '@domain/entities/user.entity';
import {createUserDtoObj, loginUserDtoObj, userEntity, userObj} from '@tests/fixtures';

describe('user.repository tests', () => {
    class MockUserRepository implements UserRepository {
        async create(createUserDto: CreateUserDto): Promise<UserEntity> {
            return userEntity;
        }
        async login(loginUserDto: LoginUserDto): Promise<UserEntity> {
            return userEntity;
        }
        async getById(getUserByIdDto: GetUserByIdDto): Promise<UserEntity> {
            return userEntity;
        }
    }

    const mockUserRepository = new MockUserRepository();

    test('abstract class should include all its methods', () => {
        expect(mockUserRepository).toBeInstanceOf(MockUserRepository);
        expect(typeof mockUserRepository.create).toBe('function');
        expect(typeof mockUserRepository.login).toBe('function');
    });

    test('create method should return an UserEntity instance', async () => {
        const [, dto] = CreateUserDto.create(createUserDtoObj);

        const result = await mockUserRepository.create(dto!);

        expect(result).toBeInstanceOf(UserEntity);
    });

    test('login method should return an UserEntity instance', async () => {
        const [, dto] = LoginUserDto.create(loginUserDtoObj);

        const result = await mockUserRepository.login(dto!);

        expect(result).toBeInstanceOf(UserEntity);
    });

    test('getById() method should return an UserEntity instance', async () => {
        const [, dto] = GetUserByIdDto.create(userObj.id);

        const result = await mockUserRepository.getById(dto!);

        expect(result).toBeInstanceOf(UserEntity);
    });
});
