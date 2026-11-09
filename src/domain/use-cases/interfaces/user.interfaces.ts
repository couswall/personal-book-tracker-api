import {UserEntity} from '@domain/entities/user.entity';
import {CreateUserDto, LoginUserDto} from '@domain/dtos';

export interface CreateUserUseCase {
    execute(dto: CreateUserDto): Promise<CreateUserResponse>;
}

export interface CreateUserResponse {
    user: UserEntity;
    token: string;
    refreshToken: string;
}

export interface LoginUserUseCase {
    execute(loginUserDto: LoginUserDto): Promise<LoginResponse>;
}

export interface LoginResponse {
    user: UserEntity;
    token: string;
    refreshToken: string;
}

export interface RefreshTokenUseCase {
    execute(refreshToken: string): Promise<RefreshTokenResponse>;
}

export interface RefreshTokenResponse {
    user: UserEntity;
    token: string;
    refreshToken: string;
}
