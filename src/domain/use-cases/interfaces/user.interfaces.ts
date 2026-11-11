import {UserEntity} from '@domain/entities/user.entity';
import {CreateUserDto, LoginUserDto} from '@domain/dtos';

export interface AuthTokens {
    accessToken: string;
    refreshToken: string;
}

export interface AuthResponse extends AuthTokens {
    user: UserEntity;
}

export interface CreateUserUseCase {
    execute(dto: CreateUserDto): Promise<AuthResponse>;
}

export interface LoginUserUseCase {
    execute(loginUserDto: LoginUserDto): Promise<AuthResponse>;
}

export interface RefreshTokenUseCase {
    execute(refreshToken: string): Promise<AuthResponse>;
}
