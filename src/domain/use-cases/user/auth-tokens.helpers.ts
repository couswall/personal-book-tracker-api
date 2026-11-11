import {JwtAdapter} from '@src/config';
import {CustomError} from '@domain/errors/custom.error';
import {AuthTokens} from '@domain/use-cases/interfaces/user.interfaces';
import {ERROR_MESSAGES} from '@infrastructure/constants';

export const generateAuthTokens = async (userId: number): Promise<AuthTokens> => {
    const [accessToken, refreshToken] = await Promise.all([
        JwtAdapter.generateAccessToken({id: userId}),
        JwtAdapter.generateRefreshToken({id: userId}),
    ]);

    if (!accessToken || !refreshToken)
        throw CustomError.internalServer(ERROR_MESSAGES.TOKEN.CREATING);

    return {accessToken, refreshToken};
};
