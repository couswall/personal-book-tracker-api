import { regularExps } from "@config/regular-exp";
import { DTOS_ERRORS } from "@domain/constants/user.constants";
import { ILoginUserDto } from "@domain/interfaces/user.interfaces";

export class LoginUserDto{
    constructor(
        public readonly emailOrUsername: string,
        public readonly password: string,
    ){};

    static validate(object: ILoginUserDto): string | null{
        const {emailOrUsername, password} = object;

        if(!emailOrUsername) return DTOS_ERRORS.LOGIN_USER.EMAIL_USERNAME.REQUIRED;        
        if(typeof emailOrUsername !== 'string') return DTOS_ERRORS.LOGIN_USER.EMAIL_USERNAME.STRING;
        if(emailOrUsername.trim().length === 0) return DTOS_ERRORS.LOGIN_USER.EMAIL_USERNAME.BLANK_SPACES;        

        if(!password) return DTOS_ERRORS.CREATE_USER.PASSWORD.REQUIRED;
        if(typeof password !== 'string') return DTOS_ERRORS.CREATE_USER.PASSWORD.STRING;
        if(!regularExps.password.test(password)) return DTOS_ERRORS.CREATE_USER.PASSWORD.FORMAT;

        return null;
    }

    static create(object: ILoginUserDto): [string?, LoginUserDto?]{
        const {emailOrUsername, password} = object;
        const errorMsg = LoginUserDto.validate(object);

        if(errorMsg) return [errorMsg];

        return [undefined, new LoginUserDto(emailOrUsername, password)];
    }
}