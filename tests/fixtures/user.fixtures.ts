import { UserEntity } from "@domain/entities/user.entity";

export const userObj = {
    id: 1,
    fullName: 'Alex Testing',
    username: 'testing_user',
    email: 'testingUser@google.com',
    password: 'Password$1234',
    createdAt: new Date(),
    updatedAt: null,
    deletedAt: null,
};

export const userEntity = UserEntity.fromObject(userObj);

export const createUserDtoObj = {
    fullName: userObj.fullName,
    username: userObj.username,
    email: userObj.email,
    password: userObj.password,
};

export const loginUserDtoObj = {
    emailOrUsername: userObj.email,
    password: userObj.password,
};

export const mockUserPrisma = {
    ...userObj,
}