import jwt, {Algorithm, SignOptions} from 'jsonwebtoken';
import {StringValue} from 'ms';
import {envs} from '@config/envs';
import {CustomError} from '@domain/errors/custom.error';
import {ERROR_MESSAGES} from '@infrastructure/constants';

interface IPayloadJWT {
    id: number;
}

const JWT_SEED = envs.JWT_SEED;
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
    static async generateToken(
        payload: IPayloadJWT,
        duration: StringValue = '2h'
    ): Promise<string | undefined> {
        return new Promise((resolve) => {
            const options: SignOptions = {expiresIn: duration, algorithm: JWT_ALGORITHM};
            jwt.sign(payload, JWT_SEED, options, (error, token) => {
                if (error) return resolve(undefined);

                resolve(token);
            });
        });
    }

    static async validateToken(token: string): Promise<IPayloadJWT> {
        return new Promise((resolve, reject) => {
            jwt.verify(
                token,
                JWT_SEED,
                {algorithms: [JWT_ALGORITHM]},
                (error, decode) => {
                    if (error)
                        return reject(
                            CustomError.unauthorized(ERROR_MESSAGES.TOKEN.INVALID)
                        );
                    if (!isIPayloadJWT(decode))
                        return reject(
                            CustomError.unauthorized(ERROR_MESSAGES.TOKEN.INVALID)
                        );
                    resolve(decode);
                }
            );
        });
    }
}
