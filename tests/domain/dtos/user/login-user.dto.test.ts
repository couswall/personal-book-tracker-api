import {LoginUserDto} from '@domain/dtos';
import {DTOS_ERRORS} from '@domain/constants/user.constants';
import {ILoginUserDto} from '@domain/interfaces/user.interfaces';
import {loginUserDtoObj} from '@tests/fixtures';

describe('login-user.dto tests', () => {
    test('should create a LoginUserDto instance from a valid object', () => {
        const [error, dto] = LoginUserDto.create(loginUserDtoObj);

        expect(error).toBeUndefined();
        expect(dto).toBeInstanceOf(LoginUserDto);
    });

    describe('emailOrUsername validation', () => {
        test('should throw an error when emailOrUsername property is undefined', () => {
            const newObj = {
                ...loginUserDtoObj,
                emailOrUsername: undefined,
            } as unknown as ILoginUserDto;
            const [error, dto] = LoginUserDto.create(newObj);

            expect(error).toBe(DTOS_ERRORS.LOGIN_USER.EMAIL_USERNAME.REQUIRED);
            expect(dto).toBeUndefined();
        });
        test('should throw an error when emailOrUsername property is not a string', () => {
            const newObj = {
                ...loginUserDtoObj,
                emailOrUsername: [true],
            } as unknown as ILoginUserDto;
            const [error, dto] = LoginUserDto.create(newObj);

            expect(error).toBe(DTOS_ERRORS.LOGIN_USER.EMAIL_USERNAME.STRING);
            expect(dto).toBeUndefined();
        });
        test('should throw an error when emailOrUsername contains only blank spaces', () => {
            const newObj = {...loginUserDtoObj, emailOrUsername: '    '};
            const [error, dto] = LoginUserDto.create(newObj);

            expect(error).toBe(DTOS_ERRORS.LOGIN_USER.EMAIL_USERNAME.BLANK_SPACES);
            expect(dto).toBeUndefined();
        });
    });

    describe('password validation', () => {
        test('should throw an error when password property is undefined', () => {
            const newObj = {
                ...loginUserDtoObj,
                password: undefined,
            } as unknown as ILoginUserDto;
            const [error, dto] = LoginUserDto.create(newObj);

            expect(error).toBe(DTOS_ERRORS.CREATE_USER.PASSWORD.REQUIRED);
            expect(dto).toBeUndefined();
        });
        test('should throw an error when password property is not a string', () => {
            const newObj = {
                ...loginUserDtoObj,
                password: [true],
            } as unknown as ILoginUserDto;
            const [error, dto] = LoginUserDto.create(newObj);

            expect(error).toBe(DTOS_ERRORS.CREATE_USER.PASSWORD.STRING);
            expect(dto).toBeUndefined();
        });
        test('should throw an error when password format is invalid', () => {
            const newObj = {...loginUserDtoObj, password: '12 p'};
            const [error, dto] = LoginUserDto.create(newObj);

            expect(error).toBe(DTOS_ERRORS.CREATE_USER.PASSWORD.FORMAT);
            expect(dto).toBeUndefined();
        });
    });
});
