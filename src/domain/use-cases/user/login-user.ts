import { JwtAdapter } from "@src/config";
import { LoginUserDto } from "@domain/dtos";
import { UserRepository } from "@domain/repositories/user.repository";
import { CustomError } from "@domain/errors/custom.error";
import { LoginResponse, LoginUserUseCase } from "@domain/use-cases/interfaces/user.interfaces";
import { ERROR_MESSAGES } from "@infrastructure/constants";

export class LoginUser implements LoginUserUseCase{
    constructor(
        private readonly repository: UserRepository,
    ){};

    async execute(loginUserDto: LoginUserDto): Promise<LoginResponse> {
        const user = await this.repository.login(loginUserDto);

        const token = await JwtAdapter.generateToken({
            id: user.id,
            username: user.username,
            email: user.email,
        });
        
        if(!token) throw CustomError.internalServer(ERROR_MESSAGES.TOKEN.CREATING);

        return {user, token};
    }
}