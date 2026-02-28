import {UserEntity} from '@domain/entities/user.entity';
import {userObj} from '@tests/fixtures';

describe('user.entity tests', () => {
    test('should create an UserEntity intance from valid properties', () => {
        const userEntity = new UserEntity(
            userObj.id,
            userObj.fullName,
            userObj.username,
            userObj.email,
            userObj.password,
            userObj.createdAt,
            userObj.updatedAt,
            userObj.deletedAt
        );

        expect(userEntity).toBeInstanceOf(UserEntity);
    });

    test('fromObject() method should create an UserEntity instance from valid object', () => {
        const result = UserEntity.fromObject(userObj);

        expect(result).toBeInstanceOf(UserEntity);
    });
});
