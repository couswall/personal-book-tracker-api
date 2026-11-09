import {Request, Response} from 'express';
import {CreateUserDto, LoginUserDto} from '@domain/dtos';
import {UserRepository} from '@domain/repositories/user.repository';
import {CreateUser, LoginUser, RefreshToken} from '@domain/use-cases';
import {CustomError} from '@domain/errors/custom.error';
import {
    REFRESH_COOKIE_NAME,
    refreshCookieOptions,
} from '@presentation/auth/cookie-options';

export class AuthController {
    constructor(private readonly repository: UserRepository) {}

    public loginUser = (req: Request, res: Response) => {
        const [errorMsg, dto] = LoginUserDto.create(req.body);
        if (errorMsg) {
            res.status(400).json({
                success: false,
                error: {message: errorMsg},
            });
            return;
        }

        if (!dto) return;

        new LoginUser(this.repository)
            .execute(dto)
            .then(({user, token, refreshToken}) => {
                const {
                    password: _password,
                    deletedAt: _deletedAt,
                    ...responseUser
                } = user;

                res.cookie(REFRESH_COOKIE_NAME, refreshToken, refreshCookieOptions);

                res.status(200).json({
                    success: true,
                    message: 'Login successfully',
                    data: {
                        user: responseUser,
                        token,
                    },
                });
            })
            .catch((error) => CustomError.handleError(error, res));
    };

    public registerUser = (req: Request, res: Response) => {
        const [errorMsg, dto] = CreateUserDto.create(req.body);
        if (errorMsg) {
            res.status(400).json({
                success: false,
                error: {message: errorMsg},
            });
            return;
        }

        if (!dto) return;

        new CreateUser(this.repository)
            .execute(dto)
            .then(({user, token, refreshToken}) => {
                const {
                    password: _password,
                    deletedAt: _deletedAt,
                    ...responseUser
                } = user;

                res.cookie(REFRESH_COOKIE_NAME, refreshToken, refreshCookieOptions);

                res.status(201).json({
                    success: true,
                    message: 'User created successfully',
                    data: {
                        user: responseUser,
                        token,
                    },
                });
            })
            .catch((error) => CustomError.handleError(error, res));
    };

    public refreshToken = (req: Request, res: Response) => {
        const token = req.cookies[REFRESH_COOKIE_NAME];

        if (!token || typeof token !== 'string') {
            res.status(401).json({
                success: false,
                error: {message: 'No token provided'},
            });
            return;
        }

        new RefreshToken(this.repository)
            .execute(token)
            .then(({user, token, refreshToken}) => {
                const {
                    password: _password,
                    deletedAt: _deletedAt,
                    ...responseUser
                } = user;

                res.cookie(REFRESH_COOKIE_NAME, refreshToken, refreshCookieOptions);

                res.status(200).json({
                    success: true,
                    message: 'Token refreshed successfully',
                    data: {
                        user: responseUser,
                        token,
                    },
                });
            })
            .catch((error) => CustomError.handleError(error, res));
    };

    public logoutUser = (req: Request, res: Response) => {
        res.clearCookie(REFRESH_COOKIE_NAME, refreshCookieOptions);
        res.status(200).json({
            success: true,
            message: 'Logout successfully',
        });
    };
}
