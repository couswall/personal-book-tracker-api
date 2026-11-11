import {LoginUserDto} from '@domain/dtos';
import {UserRepository} from '@domain/repositories/user.repository';
import {
    AuthResponse,
    LoginUserUseCase,
} from '@domain/use-cases/interfaces/user.interfaces';
import {generateAuthTokens} from '@domain/use-cases/user/auth-tokens.helpers';

export class LoginUser implements LoginUserUseCase {
    constructor(private readonly repository: UserRepository) {}

    async execute(loginUserDto: LoginUserDto): Promise<AuthResponse> {
        const user = await this.repository.login(loginUserDto);
        const tokens = await generateAuthTokens(user.id);

        return {user, ...tokens};
    }
}
