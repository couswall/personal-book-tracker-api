import {BCryptAdapter} from '@src/config';
import {UserRepository} from '@domain/repositories/user.repository';
import {CreateUserDto} from '@domain/dtos';
import {
    AuthResponse,
    CreateUserUseCase,
} from '@domain/use-cases/interfaces/user.interfaces';
import {generateAuthTokens} from '@domain/use-cases/user/auth-tokens.helpers';

export class CreateUser implements CreateUserUseCase {
    constructor(private readonly repository: UserRepository) {}

    async execute(dto: CreateUserDto): Promise<AuthResponse> {
        const hashPassword = BCryptAdapter.hash(dto.password);
        const newDto = new CreateUserDto(
            dto.fullName,
            dto.username,
            dto.email,
            hashPassword
        );
        const user = await this.repository.create(newDto);
        const tokens = await generateAuthTokens(user.id);

        return {user, ...tokens};
    }
}
