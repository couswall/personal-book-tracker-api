import { prisma } from "@data/postgres";
import { BCryptAdapter } from "@src/config";
import { CreateUserDto, GetUserByIdDto, LoginUserDto } from "@domain/dtos/index";
import { CustomError } from "@domain/errors/custom.error";
import { UserEntity } from "@domain/entities/user.entity";
import { UserDatasource } from "@domain/datasources/user.datasource";
import { ERROR_MESSAGES } from "@infrastructure/constants";

export class UserDatasourceImpl implements UserDatasource{
    
    async create(createUserDto: CreateUserDto): Promise<UserEntity> {
        const existingUsername = await prisma.user.findFirst({
            where: {username: createUserDto.username, deletedAt: null,}
        });

        const existingEmail = await prisma.user.findFirst({
            where: {email: createUserDto.email, deletedAt: null,}
        });

        if(existingUsername) throw CustomError.badRequest(ERROR_MESSAGES.USER.CREATE.EXISTING_USERNAME);
        if(existingEmail) throw CustomError.badRequest(ERROR_MESSAGES.USER.CREATE.EXISTING_EMAIL);

        const newUser = await prisma.user.create({
            data: {
                fullName: createUserDto.fullName,
                username: createUserDto.username,
                email: createUserDto.email,
                password: createUserDto.password
            }
        });

        await prisma.bookshelf.createMany({
            data: [
                {name: 'To be Read', type: 'TO_BE_READ', userId: newUser.id},
                {name: 'Currently Reading', type: 'CURRENTLY_READING', userId: newUser.id},
                {name: 'Read', type: 'READ', userId: newUser.id},
            ],
        });
        
        return UserEntity.fromObject(newUser);
    }

    async login(loginUserDto: LoginUserDto): Promise<UserEntity>{
        const user = await prisma.user.findFirst({
            where: {
                OR: [
                    {email: loginUserDto.emailOrUsername, deletedAt: null,},
                    {username: loginUserDto.emailOrUsername, deletedAt: null,},
                ]
            } 
        });

        if(!user) throw CustomError.badRequest(ERROR_MESSAGES.USER.LOGIN.INVALID_CREDENTIALS);

        const passwordMatch = BCryptAdapter.compare(loginUserDto.password, user.password);

        if(!passwordMatch) throw CustomError.badRequest(ERROR_MESSAGES.USER.LOGIN.INVALID_CREDENTIALS);

        return UserEntity.fromObject(user);
    }

    async getById(getUserByIdDto: GetUserByIdDto): Promise<UserEntity>{
        const {id} = getUserByIdDto;
        const user = await prisma.user.findFirst({
            where: {id, deletedAt: null}
        });

        if(!user) throw CustomError.badRequest(ERROR_MESSAGES.USER.GET_BY_ID.NO_EXISTING);

        return UserEntity.fromObject(user);
    }
}