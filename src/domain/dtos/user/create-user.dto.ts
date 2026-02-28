import { regularExps } from "@config/regular-exp";
import { ICreateUserDto } from "@domain/interfaces/user.interfaces";
import { DTOS_ERRORS } from "@domain/constants/user.constants";

export class CreateUserDto{
    constructor(
        public readonly fullName: string,
        public readonly username: string,
        public readonly email: string,
        public readonly password: string,
    ){};

    static validate(object: ICreateUserDto): string | null{
        const {fullName, username, email, password} = object;

        if(!fullName) return DTOS_ERRORS.CREATE_USER.FULLNAME.REQUIRED;
        if(typeof fullName !== 'string') return DTOS_ERRORS.CREATE_USER.FULLNAME.STRING;
        if(fullName.length < 3) return DTOS_ERRORS.CREATE_USER.FULLNAME.MIN_LENGTH;
        if(fullName.length > 40) return DTOS_ERRORS.CREATE_USER.FULLNAME.MAX_LENGTH;
        if(fullName.trim().length === 0) return DTOS_ERRORS.CREATE_USER.FULLNAME.BLANK_SPACES;
        if(!regularExps.fullname.test(fullName)) return DTOS_ERRORS.CREATE_USER.FULLNAME.FORMAT;

        if(!username) return DTOS_ERRORS.CREATE_USER.USERNAME.REQUIRED;
        if(typeof username !== 'string') return DTOS_ERRORS.CREATE_USER.USERNAME.STRING;
        if(username.length < 3) return DTOS_ERRORS.CREATE_USER.USERNAME.MIN_LENGTH;
        if(username.length > 30) return DTOS_ERRORS.CREATE_USER.USERNAME.MAX_LENGTH;
        if(!regularExps.username.test(username)) return DTOS_ERRORS.CREATE_USER.USERNAME.FORMAT;

        if(!email) return DTOS_ERRORS.CREATE_USER.EMAIL.REQUIRED;
        if(typeof email !== 'string') return DTOS_ERRORS.CREATE_USER.EMAIL.STRING;
        if(!regularExps.email.test(email)) return DTOS_ERRORS.CREATE_USER.EMAIL.FORMAT;
        
        if(!password) return DTOS_ERRORS.CREATE_USER.PASSWORD.REQUIRED;
        if(typeof password !== 'string') return DTOS_ERRORS.CREATE_USER.PASSWORD.STRING;
        if(!regularExps.password.test(password)) return DTOS_ERRORS.CREATE_USER.PASSWORD.FORMAT;

        return null;
    }

    static create(object: ICreateUserDto): [string?, CreateUserDto?]{
        const {fullName, username, password, email} = object;
        const errorMsg = CreateUserDto.validate(object);

        if(errorMsg) return [errorMsg];

        return[undefined, new CreateUserDto(fullName.trim(), username, email, password)];
    }
}