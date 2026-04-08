import request from 'supertest';
import {prisma} from '@data/postgres';
import {testServer} from '@tests/test-server';
import {setupAuthRoutes} from './setup';
import {createUserDtoObj, loginUserDtoObj} from '@tests/fixtures';
import {ERROR_MESSAGES} from '@infrastructure/constants';
import {DTOS_ERRORS} from '@domain/constants/user.constants';
import {BCryptAdapter} from '@config/bcrypt.adapter';

describe('/api/auth/login endpoint', () => {
    setupAuthRoutes();

    test('should return a 200 status and user data after login', async () => {
        await prisma.user.create({
            data: {
                ...createUserDtoObj,
                password: BCryptAdapter.hash(createUserDtoObj.password),
            },
        });

        const {body} = await request(testServer.app)
            .post('/api/auth/login')
            .send(loginUserDtoObj)
            .expect(200);

        expect(body).toEqual({
            success: true,
            message: expect.any(String),
            data: {
                user: expect.any(Object),
                token: expect.any(String),
            },
        });
    });

    test('should throw a 400 error status if body request is empty', async () => {
        const {body} = await request(testServer.app)
            .post('/api/auth/login')
            .send({})
            .expect(400);

        expect(body).toEqual({
            success: false,
            error: {message: DTOS_ERRORS.LOGIN_USER.EMAIL_USERNAME.REQUIRED},
        });
    });

    test('should throw a 400 error status if password is invalid', async () => {
        await prisma.user.create({
            data: {
                ...createUserDtoObj,
                password: BCryptAdapter.hash('anotherPassword1234&'),
            },
        });

        const {body} = await request(testServer.app)
            .post('/api/auth/login')
            .send(loginUserDtoObj)
            .expect(400);

        expect(body).toEqual({
            success: false,
            error: {message: ERROR_MESSAGES.USER.LOGIN.INVALID_CREDENTIALS},
        });
    });

    test('should throw a 400 error status if email does not exist', async () => {
        await prisma.user.create({
            data: {
                ...createUserDtoObj,
                password: BCryptAdapter.hash(createUserDtoObj.password),
            },
        });

        const {body} = await request(testServer.app)
            .post('/api/auth/login')
            .send({...loginUserDtoObj, emailOrUsername: 'anotherEmail@google.com'})
            .expect(400);

        expect(body).toEqual({
            success: false,
            error: {message: ERROR_MESSAGES.USER.LOGIN.INVALID_CREDENTIALS},
        });
    });

    test('should throw a 400 error status if username does not exist', async () => {
        await prisma.user.create({
            data: {
                ...createUserDtoObj,
                password: BCryptAdapter.hash(createUserDtoObj.password),
            },
        });

        const {body} = await request(testServer.app)
            .post('/api/auth/login')
            .send({...loginUserDtoObj, emailOrUsername: 'no_userFound1'})
            .expect(400);

        expect(body).toEqual({
            success: false,
            error: {message: ERROR_MESSAGES.USER.LOGIN.INVALID_CREDENTIALS},
        });
    });

    describe('emailOrUsername validation', () => {
        test('should throw a 400 error status if emailOrUsername is undefined', async () => {
            const {body} = await request(testServer.app)
                .post('/api/auth/login')
                .send({password: loginUserDtoObj.password})
                .expect(400);

            expect(body).toEqual({
                success: false,
                error: {message: DTOS_ERRORS.LOGIN_USER.EMAIL_USERNAME.REQUIRED},
            });
        });

        test('should throw a 400 error status if emailOrUsername is not a string', async () => {
            const {body} = await request(testServer.app)
                .post('/api/auth/login')
                .send({...loginUserDtoObj, emailOrUsername: 1234})
                .expect(400);

            expect(body).toEqual({
                success: false,
                error: {message: DTOS_ERRORS.LOGIN_USER.EMAIL_USERNAME.STRING},
            });
        });

        test('should throw a 400 error status if emailOrUsername contains only blank spaces', async () => {
            const {body} = await request(testServer.app)
                .post('/api/auth/login')
                .send({...loginUserDtoObj, emailOrUsername: '    '})
                .expect(400);

            expect(body).toEqual({
                success: false,
                error: {message: DTOS_ERRORS.LOGIN_USER.EMAIL_USERNAME.BLANK_SPACES},
            });
        });
    });

    describe('password validation', () => {
        test('should throw a 400 error status if password is undefined', async () => {
            const {body} = await request(testServer.app)
                .post('/api/auth/login')
                .send({emailOrUsername: loginUserDtoObj.emailOrUsername})
                .expect(400);

            expect(body).toEqual({
                success: false,
                error: {message: DTOS_ERRORS.CREATE_USER.PASSWORD.REQUIRED},
            });
        });

        test('should throw a 400 error status if password is not a string', async () => {
            const {body} = await request(testServer.app)
                .post('/api/auth/login')
                .send({...loginUserDtoObj, password: 190})
                .expect(400);

            expect(body).toEqual({
                success: false,
                error: {message: DTOS_ERRORS.CREATE_USER.PASSWORD.STRING},
            });
        });

        test('should throw a 400 error status if password format is invalid', async () => {
            const {body} = await request(testServer.app)
                .post('/api/auth/login')
                .send({...loginUserDtoObj, password: 'pass><1'})
                .expect(400);

            expect(body).toEqual({
                success: false,
                error: {message: DTOS_ERRORS.CREATE_USER.PASSWORD.FORMAT},
            });
        });
    });
});
