import {JwtAdapter} from '@src/config';
import {GetUserByIdDto} from '@domain/dtos';
import {UserRepository} from '@domain/repositories/user.repository';
import {CustomError} from '@domain/errors/custom.error';
import {
    AuthResponse,
    RefreshTokenUseCase,
} from '@domain/use-cases/interfaces/user.interfaces';
import {generateAuthTokens} from '@domain/use-cases/user/auth-tokens.helpers';
import {ERROR_MESSAGES} from '@infrastructure/constants';

export class RefreshToken implements RefreshTokenUseCase {
    constructor(private readonly repository: UserRepository) {}

    async execute(refreshToken: string): Promise<AuthResponse> {
        const payload = await JwtAdapter.validateRefreshToken(refreshToken);

        const [error, getUserByIdDto] = GetUserByIdDto.create(payload.id);
        if (error) throw CustomError.badRequest(error);
        if (!getUserByIdDto)
            throw CustomError.internalServer(ERROR_MESSAGES.TOKEN.CREATING);

        const user = await this.repository.getById(getUserByIdDto);
        const tokens = await generateAuthTokens(user.id);

        return {user, ...tokens};
    }
}
