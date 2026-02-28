import {CreateUserDto} from '@domain/dtos';
import {createUserDtoObj} from '@tests/fixtures';
import {DTOS_ERRORS} from '@domain/constants/user.constants';
import {ICreateUserDto} from '@domain/interfaces/user.interfaces';

describe('create-user.dto', () => {
    test('should create a CreateUserDto instance from a valid object', () => {
        const [error, dto] = CreateUserDto.create(createUserDtoObj);

        expect(dto).toBeInstanceOf(CreateUserDto);
        expect(error).toBeUndefined();
    });

    describe('fullName validation', () => {
        test('should throw an error when fullName property is undefined', () => {
            const newObj = {
                ...createUserDtoObj,
                fullName: undefined,
            } as unknown as ICreateUserDto;
            const [error, dto] = CreateUserDto.create(newObj);

            expect(error).toBe(DTOS_ERRORS.CREATE_USER.FULLNAME.REQUIRED);
            expect(dto).toBeUndefined();
        });
        test('should throw an error when fullName property is not a string', () => {
            const newObj = {
                ...createUserDtoObj,
                fullName: 1234,
            } as unknown as ICreateUserDto;
            const [error, dto] = CreateUserDto.create(newObj);

            expect(error).toBe(DTOS_ERRORS.CREATE_USER.FULLNAME.STRING);
            expect(dto).toBeUndefined();
        });
        test('should throw an error when fullName length is less than 3 characters long', () => {
            const newObj = {...createUserDtoObj, fullName: 'an'};
            const [error, dto] = CreateUserDto.create(newObj);

            expect(error).toBe(DTOS_ERRORS.CREATE_USER.FULLNAME.MIN_LENGTH);
            expect(dto).toBeUndefined();
        });
        test('should throw an error when fullName length is more than 40 characters long', () => {
            const newObj = {...createUserDtoObj, fullName: 'testing '.repeat(40)};
            const [error, dto] = CreateUserDto.create(newObj);

            expect(error).toBe(DTOS_ERRORS.CREATE_USER.FULLNAME.MAX_LENGTH);
            expect(dto).toBeUndefined();
        });
        test('should throw an error when fullName contains only blank spaces', () => {
            const newObj = {...createUserDtoObj, fullName: '     '};
            const [error, dto] = CreateUserDto.create(newObj);

            expect(error).toBe(DTOS_ERRORS.CREATE_USER.FULLNAME.BLANK_SPACES);
            expect(dto).toBeUndefined();
        });
        test('should throw an error when fullName contains an invalid character', () => {
            const newObj = {...createUserDtoObj, fullName: 'Alex T3st.&ing--'};
            const [error, dto] = CreateUserDto.create(newObj);

            expect(error).toBe(DTOS_ERRORS.CREATE_USER.FULLNAME.FORMAT);
            expect(dto).toBeUndefined();
        });
    });

    describe('username validation', () => {
        test('should throw an error when username property is undefined', () => {
            const newObj = {
                ...createUserDtoObj,
                username: undefined,
            } as unknown as ICreateUserDto;
            const [error, dto] = CreateUserDto.create(newObj);

            expect(error).toBe(DTOS_ERRORS.CREATE_USER.USERNAME.REQUIRED);
            expect(dto).toBeUndefined();
        });
        test('should throw an error when username property is not a string', () => {
            const newObj = {
                ...createUserDtoObj,
                username: true,
            } as unknown as ICreateUserDto;
            const [error, dto] = CreateUserDto.create(newObj);

            expect(error).toBe(DTOS_ERRORS.CREATE_USER.USERNAME.STRING);
            expect(dto).toBeUndefined();
        });
        test('should throw an error when username length is less than 3 characters long', () => {
            const newObj = {...createUserDtoObj, username: 'an'};
            const [error, dto] = CreateUserDto.create(newObj);

            expect(error).toBe(DTOS_ERRORS.CREATE_USER.USERNAME.MIN_LENGTH);
            expect(dto).toBeUndefined();
        });
        test('should throw an error when username length is more than 30 characters long', () => {
            const newObj = {...createUserDtoObj, username: 'testing '.repeat(40)};
            const [error, dto] = CreateUserDto.create(newObj);

            expect(error).toBe(DTOS_ERRORS.CREATE_USER.USERNAME.MAX_LENGTH);
            expect(dto).toBeUndefined();
        });
        test('should throw an error when username format is invalid', () => {
            const newObj = {...createUserDtoObj, username: 'alexT$sti.ng_# '};
            const [error, dto] = CreateUserDto.create(newObj);

            expect(error).toBe(DTOS_ERRORS.CREATE_USER.USERNAME.FORMAT);
            expect(dto).toBeUndefined();
        });
    });

    describe('email validation', () => {
        test('should throw an error when email property is undefined', () => {
            const newObj = {
                ...createUserDtoObj,
                email: undefined,
            } as unknown as ICreateUserDto;
            const [error, dto] = CreateUserDto.create(newObj);

            expect(error).toBe(DTOS_ERRORS.CREATE_USER.EMAIL.REQUIRED);
            expect(dto).toBeUndefined();
        });
        test('should throw an error when email property is not a string', () => {
            const newObj = {
                ...createUserDtoObj,
                email: [true],
            } as unknown as ICreateUserDto;
            const [error, dto] = CreateUserDto.create(newObj);

            expect(error).toBe(DTOS_ERRORS.CREATE_USER.EMAIL.STRING);
            expect(dto).toBeUndefined();
        });
        test('should throw an error when email format is invalid', () => {
            const newObj = {...createUserDtoObj, email: 'alex.testing@example'};
            const [error, dto] = CreateUserDto.create(newObj);

            expect(error).toBe(DTOS_ERRORS.CREATE_USER.EMAIL.FORMAT);
            expect(dto).toBeUndefined();
        });
    });

    describe('password validation', () => {
        test('should throw an error when password property is undefined', () => {
            const newObj = {
                ...createUserDtoObj,
                password: undefined,
            } as unknown as ICreateUserDto;
            const [error, dto] = CreateUserDto.create(newObj);

            expect(error).toBe(DTOS_ERRORS.CREATE_USER.PASSWORD.REQUIRED);
            expect(dto).toBeUndefined();
        });
        test('should throw an error when password property is not a string', () => {
            const newObj = {
                ...createUserDtoObj,
                password: [true],
            } as unknown as ICreateUserDto;
            const [error, dto] = CreateUserDto.create(newObj);

            expect(error).toBe(DTOS_ERRORS.CREATE_USER.PASSWORD.STRING);
            expect(dto).toBeUndefined();
        });
        test('should throw an error when password format is invalid', () => {
            const newObj = {...createUserDtoObj, password: 'pass '};
            const [error, dto] = CreateUserDto.create(newObj);

            expect(error).toBe(DTOS_ERRORS.CREATE_USER.PASSWORD.FORMAT);
            expect(dto).toBeUndefined();
        });
    });
});
