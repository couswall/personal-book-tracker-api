import {Request, Response} from 'express';
import {CreateUserDto, LoginUserDto} from '@domain/dtos';
import {UserRepository} from '@domain/repositories/user.repository';
import {CreateUser, LoginUser, RefreshToken} from '@domain/use-cases';
import {AuthResponse} from '@domain/use-cases/interfaces/user.interfaces';
import {CustomError} from '@domain/errors/custom.error';
import {ERROR_MESSAGES} from '@infrastructure/constants';
import {
    REFRESH_COOKIE_NAME,
    refreshCookieOptions,
} from '@presentation/auth/cookie-options';

export class AuthController {
    constructor(private readonly repository: UserRepository) {}

    private sendAuthResponse(
        res: Response,
        status: number,
        message: string,
        {user, accessToken, refreshToken}: AuthResponse
    ) {
        const {password: _password, deletedAt: _deletedAt, ...responseUser} = user;

        res.cookie(REFRESH_COOKIE_NAME, refreshToken, refreshCookieOptions);

        res.status(status).json({
            success: true,
            message,
            data: {
                user: responseUser,
                token: accessToken,
            },
        });
    }

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
            .then((result) =>
                this.sendAuthResponse(res, 200, 'Login successfully', result)
            )
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
            .then((result) =>
                this.sendAuthResponse(res, 201, 'User created successfully', result)
            )
            .catch((error) => CustomError.handleError(error, res));
    };

    public refreshToken = (req: Request, res: Response) => {
        const refreshToken = req.cookies[REFRESH_COOKIE_NAME];

        if (typeof refreshToken !== 'string') {
            CustomError.handleError(
                CustomError.unauthorized(ERROR_MESSAGES.TOKEN.NO_TOKEN),
                res
            );
            return;
        }

        new RefreshToken(this.repository)
            .execute(refreshToken)
            .then((result) =>
                this.sendAuthResponse(res, 200, 'Token refreshed successfully', result)
            )
            .catch((error) => {
                if (error instanceof CustomError && error.statusCode === 401)
                    res.clearCookie(REFRESH_COOKIE_NAME, refreshCookieOptions);

                CustomError.handleError(error, res);
            });
    };

    public logoutUser = (req: Request, res: Response) => {
        res.clearCookie(REFRESH_COOKIE_NAME, refreshCookieOptions);
        res.status(200).json({
            success: true,
            message: 'Logout successfully',
        });
    };
}
