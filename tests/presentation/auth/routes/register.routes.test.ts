import request from 'supertest';
import {prisma} from '@data/postgres';
import {testServer} from '@tests/test-server';
import {setupAuthRoutes} from './setup';
import {createUserDtoObj} from '@tests/fixtures';
import {ERROR_MESSAGES} from '@infrastructure/constants';
import {DTOS_ERRORS} from '@domain/constants/user.constants';

describe('/api/auth/register endpoint', () => {
    setupAuthRoutes();

    test('should return a 201 status and a new user', async () => {
        const {body} = await request(testServer.app)
            .post('/api/auth/register')
            .send(createUserDtoObj)
            .expect(201);

        expect(body).toEqual({
            success: true,
            message: expect.any(String),
            data: {
                token: expect.any(String),
                user: expect.any(Object),
            },
        });
    });

    test('should throw a 400 status if body request is empty', async () => {
        const {body} = await request(testServer.app)
            .post('/api/auth/register')
            .send({})
            .expect(400);

        expect(body).toEqual({
            success: false,
            error: {message: expect.any(String)},
        });
    });

    test('should throw a 400 error status if username already exists', async () => {
        await prisma.user.create({data: createUserDtoObj});

        const {body} = await request(testServer.app)
            .post('/api/auth/register')
            .send({...createUserDtoObj, email: 'any_email@gmail.com'})
            .expect(400);

        expect(body.success).toBeFalsy();
        expect(body.error.message).toBe(ERROR_MESSAGES.USER.CREATE.EXISTING_USERNAME);
    });

    test('should throw a 400 error status if email already exists', async () => {
        await prisma.user.create({data: createUserDtoObj});

        const {body} = await request(testServer.app)
            .post('/api/auth/register')
            .send({...createUserDtoObj, username: 'testing_username'})
            .expect(400);

        expect(body.success).toBeFalsy();
        expect(body.error.message).toBe(ERROR_MESSAGES.USER.CREATE.EXISTING_EMAIL);
    });

    describe('fullName validation', () => {
        test('should throw a 400 error status if fullName is undefined', async () => {
            const {body} = await request(testServer.app)
                .post('/api/auth/register')
                .send({...createUserDtoObj, fullName: undefined})
                .expect(400);

            expect(body.success).toBeFalsy();
            expect(body.error.message).toBe(DTOS_ERRORS.CREATE_USER.FULLNAME.REQUIRED);
        });

        test('should throw a 400 error status if fullName is not a string', async () => {
            const {body} = await request(testServer.app)
                .post('/api/auth/register')
                .send({...createUserDtoObj, fullName: []})
                .expect(400);

            expect(body.success).toBeFalsy();
            expect(body.error.message).toBe(DTOS_ERRORS.CREATE_USER.FULLNAME.STRING);
        });

        test('should throw a 400 error status if fullName length is less than 3 characters long', async () => {
            const {body} = await request(testServer.app)
                .post('/api/auth/register')
                .send({...createUserDtoObj, fullName: 'ab'})
                .expect(400);

            expect(body.success).toBeFalsy();
            expect(body.error.message).toBe(DTOS_ERRORS.CREATE_USER.FULLNAME.MIN_LENGTH);
        });

        test('should throw a 400 error status if fullName length is more than 40 characters long', async () => {
            const {body} = await request(testServer.app)
                .post('/api/auth/register')
                .send({...createUserDtoObj, fullName: 'Full testing name'.repeat(40)})
                .expect(400);

            expect(body.success).toBeFalsy();
            expect(body.error.message).toBe(DTOS_ERRORS.CREATE_USER.FULLNAME.MAX_LENGTH);
        });

        test('should throw a 400 error status if fullName contains only blank spaces', async () => {
            const {body} = await request(testServer.app)
                .post('/api/auth/register')
                .send({...createUserDtoObj, fullName: '   '})
                .expect(400);

            expect(body.success).toBeFalsy();
            expect(body.error.message).toBe(
                DTOS_ERRORS.CREATE_USER.FULLNAME.BLANK_SPACES
            );
        });

        test('should throw a 400 error status if fullName format is invalid', async () => {
            const {body} = await request(testServer.app)
                .post('/api/auth/register')
                .send({...createUserDtoObj, fullName: 'THis is an Invalid fullName_2122'})
                .expect(400);

            expect(body.success).toBeFalsy();
            expect(body.error.message).toBe(DTOS_ERRORS.CREATE_USER.FULLNAME.FORMAT);
        });
    });

    describe('username validation', () => {
        test('should throw a 400 error status if username is undefined', async () => {
            const {body} = await request(testServer.app)
                .post('/api/auth/register')
                .send({...createUserDtoObj, username: undefined})
                .expect(400);

            expect(body.success).toBeFalsy();
            expect(body.error.message).toBe(DTOS_ERRORS.CREATE_USER.USERNAME.REQUIRED);
        });

        test('should throw a 400 error status if username is not a string', async () => {
            const {body} = await request(testServer.app)
                .post('/api/auth/register')
                .send({...createUserDtoObj, username: []})
                .expect(400);

            expect(body.success).toBeFalsy();
            expect(body.error.message).toBe(DTOS_ERRORS.CREATE_USER.USERNAME.STRING);
        });

        test('should throw a 400 error status if username length is less than 3 characters long', async () => {
            const {body} = await request(testServer.app)
                .post('/api/auth/register')
                .send({...createUserDtoObj, username: 'ab'})
                .expect(400);

            expect(body.success).toBeFalsy();
            expect(body.error.message).toBe(DTOS_ERRORS.CREATE_USER.USERNAME.MIN_LENGTH);
        });

        test('should throw a 400 error status if username length is more than 30 characters long', async () => {
            const {body} = await request(testServer.app)
                .post('/api/auth/register')
                .send({...createUserDtoObj, username: 'username.'.repeat(40)})
                .expect(400);

            expect(body.success).toBeFalsy();
            expect(body.error.message).toBe(DTOS_ERRORS.CREATE_USER.USERNAME.MAX_LENGTH);
        });

        test('should throw a 400 error status if username format is invalid', async () => {
            const {body} = await request(testServer.app)
                .post('/api/auth/register')
                .send({...createUserDtoObj, username: 'username$14._'})
                .expect(400);

            expect(body.success).toBeFalsy();
            expect(body.error.message).toBe(DTOS_ERRORS.CREATE_USER.USERNAME.FORMAT);
        });
    });

    describe('email validation', () => {
        test('should throw a 400 error status if email is undefined', async () => {
            const {body} = await request(testServer.app)
                .post('/api/auth/register')
                .send({...createUserDtoObj, email: undefined})
                .expect(400);

            expect(body.success).toBeFalsy();
            expect(body.error.message).toBe(DTOS_ERRORS.CREATE_USER.EMAIL.REQUIRED);
        });

        test('should throw a 400 error status if email is not a string', async () => {
            const {body} = await request(testServer.app)
                .post('/api/auth/register')
                .send({...createUserDtoObj, email: 1234})
                .expect(400);

            expect(body.success).toBeFalsy();
            expect(body.error.message).toBe(DTOS_ERRORS.CREATE_USER.EMAIL.STRING);
        });

        test('should throw a 400 error status if email format is invalid', async () => {
            const {body} = await request(testServer.app)
                .post('/api/auth/register')
                .send({...createUserDtoObj, email: 'invalidemail.com'})
                .expect(400);

            expect(body.success).toBeFalsy();
            expect(body.error.message).toBe(DTOS_ERRORS.CREATE_USER.EMAIL.FORMAT);
        });
    });

    describe('password validation', () => {
        test('should throw a 400 error status if password is undefined', async () => {
            const {body} = await request(testServer.app)
                .post('/api/auth/register')
                .send({...createUserDtoObj, password: undefined})
                .expect(400);

            expect(body.success).toBeFalsy();
            expect(body.error.message).toBe(DTOS_ERRORS.CREATE_USER.PASSWORD.REQUIRED);
        });

        test('should throw a 400 error status if password is not a string', async () => {
            const {body} = await request(testServer.app)
                .post('/api/auth/register')
                .send({...createUserDtoObj, password: 1234})
                .expect(400);

            expect(body.success).toBeFalsy();
            expect(body.error.message).toBe(DTOS_ERRORS.CREATE_USER.PASSWORD.STRING);
        });

        test('should throw a 400 error status if password format is invalid', async () => {
            const {body} = await request(testServer.app)
                .post('/api/auth/register')
                .send({...createUserDtoObj, password: 'pass <'})
                .expect(400);

            expect(body.success).toBeFalsy();
            expect(body.error.message).toBe(DTOS_ERRORS.CREATE_USER.PASSWORD.FORMAT);
        });
    });
});
