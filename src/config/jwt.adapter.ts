import jwt, { SignOptions } from 'jsonwebtoken';
import { envs } from '@config/envs';
import { CustomError } from '@domain/errors/custom.error';
import { ERROR_MESSAGES } from '@infrastructure/constants';

interface IPayloadJWT{
    id: number;
    username: string;
    email: string;
}

const JWT_SEED = envs.JWT_SEED;

export class JwtAdapter {

    static async generateToken(payload: IPayloadJWT, duration: string = '2h'): Promise<string | undefined>{
        return new Promise((resolve) => {
            jwt.sign(payload, JWT_SEED, {expiresIn: duration} as SignOptions, (error, token) => {
                
                if(error) return resolve(undefined);

                resolve(token);
            });
        });
    };

    static async validateToken(token: string): Promise<IPayloadJWT>{
        return new Promise((resolve, reject) => {
            jwt.verify(token, JWT_SEED, (error, decode) => {
                if(error) reject (
                    CustomError.unauthorized(ERROR_MESSAGES.TOKEN.INVALID)
                );
                resolve(decode as IPayloadJWT);
            });
        });
    }
}