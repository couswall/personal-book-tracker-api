import jwt, {Algorithm, SignOptions} from 'jsonwebtoken';
import {StringValue} from 'ms';
import {envs} from '@config/envs';
import {REFRESH_TOKEN_DURATION} from '@config/token-lifetimes';
import {CustomError} from '@domain/errors/custom.error';
import {ERROR_MESSAGES} from '@infrastructure/constants';

interface IPayloadJWT {
    id: number;
}

const JWT_SEED = envs.JWT_SEED;
const JWT_REFRESH_SEED = envs.JWT_REFRESH_SEED;
const JWT_ALGORITHM: Algorithm = 'HS256';

function isIPayloadJWT(decode: unknown): decode is IPayloadJWT {
    return (
        typeof decode === 'object' &&
        decode !== null &&
        'id' in decode &&
        typeof decode.id === 'number'
    );
}

export class JwtAdapter {
    private static sign(
        payload: IPayloadJWT,
        secret: string,
        duration: StringValue
    ): Promise<string | undefined> {
        return new Promise((resolve) => {
            const options: SignOptions = {expiresIn: duration, algorithm: JWT_ALGORITHM};
            jwt.sign(payload, secret, options, (error, token) => {
                if (error) return resolve(undefined);

                resolve(token);
            });
        });
    }

    private static verify(token: string, secret: string): Promise<IPayloadJWT> {
        return new Promise((resolve, reject) => {
            jwt.verify(token, secret, {algorithms: [JWT_ALGORITHM]}, (error, decode) => {
                if (error)
                    return reject(CustomError.unauthorized(ERROR_MESSAGES.TOKEN.INVALID));
                if (!isIPayloadJWT(decode))
                    return reject(CustomError.unauthorized(ERROR_MESSAGES.TOKEN.INVALID));
                resolve(decode);
            });
        });
    }

    static async generateAccessToken(
        payload: IPayloadJWT,
        duration: StringValue = '15m'
    ): Promise<string | undefined> {
        return this.sign(payload, JWT_SEED, duration);
    }

    static async generateRefreshToken(payload: IPayloadJWT): Promise<string | undefined> {
        return this.sign(payload, JWT_REFRESH_SEED, REFRESH_TOKEN_DURATION);
    }

    static async validateAccessToken(token: string): Promise<IPayloadJWT> {
        return this.verify(token, JWT_SEED);
    }

    static async validateRefreshToken(token: string): Promise<IPayloadJWT> {
        return this.verify(token, JWT_REFRESH_SEED);
    }
}
