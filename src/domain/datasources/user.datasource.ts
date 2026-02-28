import { UserEntity } from "@domain/entities/user.entity";
import { CreateUserDto, GetUserByIdDto, LoginUserDto } from "@domain/dtos/index";

export abstract class UserDatasource{
    abstract create(createUserDto: CreateUserDto): Promise<UserEntity>;
    abstract login(loginUserDto: LoginUserDto): Promise<UserEntity>;
    abstract getById(getUserByIdDto: GetUserByIdDto): Promise<UserEntity>;
}