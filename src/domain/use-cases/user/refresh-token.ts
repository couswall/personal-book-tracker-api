import { JwtAdapter } from "@src/config";
import { GetUserByIdDto } from "@domain/dtos";
import { UserRepository } from "@domain/repositories/user.repository";
import { CustomError } from "@domain/errors/custom.error";
import { RefreshTokenResponse, RefreshTokenUseCase } from "@domain/use-cases/interfaces/user.interfaces";
import { ERROR_MESSAGES } from "@infrastructure/constants";

export class RefreshToken implements RefreshTokenUseCase {
    constructor(
        private readonly repository: UserRepository,
    ){};

    async execute(token: string): Promise<RefreshTokenResponse> {
        const payload = await JwtAdapter.validateToken(token);

        const [error, getUserByIdDto] = GetUserByIdDto.create(payload.id);
        if(error) throw CustomError.badRequest(error);

        const user = await this.repository.getById(getUserByIdDto!);

        const newToken = await JwtAdapter.generateToken({
            id: user.id,
            username: user.username,
            email: user.email,
        });

        if(!newToken) throw CustomError.internalServer(ERROR_MESSAGES.TOKEN.CREATING);

        return { user, token: newToken };
    }
}
