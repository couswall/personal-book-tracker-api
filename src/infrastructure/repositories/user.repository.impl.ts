import { UserDatasource } from "@domain/datasources/user.datasource";
import { CreateUserDto, GetUserByIdDto, LoginUserDto } from "@domain/dtos";
import { UserEntity } from "@domain/entities/user.entity";
import { UserRepository } from "@domain/repositories/user.repository";

export class UserRepositoryImpl implements UserRepository{
    constructor(
        private readonly datasource: UserDatasource,
    ){};

    create(createUserDto: CreateUserDto): Promise<UserEntity> {
        return this.datasource.create(createUserDto);
    }

    login(loginUserDto: LoginUserDto): Promise<UserEntity> {
        return this.datasource.login(loginUserDto);
    }

    getById(getUserByIdDto: GetUserByIdDto): Promise<UserEntity> {
        return this.datasource.getById(getUserByIdDto);
    }
}