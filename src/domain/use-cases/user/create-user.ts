import { BCryptAdapter, JwtAdapter } from "@src/config";
import { UserRepository } from "@domain/repositories/user.repository";
import { CreateUserDto } from "@domain/dtos";
import { CustomError } from "@domain/errors/custom.error";
import { CreateUserResponse, CreateUserUseCase } from "@domain/use-cases/interfaces/user.interfaces";
import { ERROR_MESSAGES } from "@infrastructure/constants";

export class CreateUser implements CreateUserUseCase{
    constructor(
        private readonly repository: UserRepository,
    ){};

    async execute(dto: CreateUserDto): Promise<CreateUserResponse> {
        const hashPassword = BCryptAdapter.hash(dto.password);
        const newDto = new CreateUserDto(
            dto.fullName,
            dto.username,
            dto.email,
            hashPassword
        );
        const user = await this.repository.create(newDto);
        const token = await JwtAdapter.generateToken({
            id: user.id,
            username: user.username,
            email: user.email,
        });
        
        if(!token) throw CustomError.internalServer(ERROR_MESSAGES.TOKEN.CREATING);

        return {user, token}
    }
}