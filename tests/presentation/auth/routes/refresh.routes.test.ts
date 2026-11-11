import request from 'supertest';
import {prisma} from '@data/postgres';
import {testServer} from '@tests/test-server';
import {BCryptAdapter} from '@config/bcrypt.adapter';
import {setupAuthRoutes} from '@tests/presentation/auth/routes/setup';
import {createUserDtoObj, loginUserDtoObj} from '@tests/fixtures';
import {ERROR_MESSAGES} from '@infrastructure/constants';

describe('/api/auth/refresh endpoint', () => {
    setupAuthRoutes();

    test('should return a new token when the refresh cookie is valid', async () => {
        await prisma.user.create({
            data: {
                ...createUserDtoObj,
                password: BCryptAdapter.hash(createUserDtoObj.password),
            },
        });
        const agent = request.agent(testServer.app);
        await agent.post('/api/auth/login').send(loginUserDtoObj).expect(200);

        const response = await agent.post('/api/auth/refresh').expect(200);

        expect(response.body.data.token).toEqual(expect.any(String));
        expect(response.headers['set-cookie'][0]).toMatch(/^refreshToken=[^;]+;/);
    });

    test('should throw a 401 error status when no refresh cookie is sent', async () => {
        await prisma.user.create({
            data: {
                ...createUserDtoObj,
                password: BCryptAdapter.hash(createUserDtoObj.password),
            },
        });
        const agent = request(testServer.app);
        await agent.post('/api/auth/login').send(loginUserDtoObj).expect(200);

        const {body} = await agent.post('/api/auth/refresh').expect(401);

        expect(body).toEqual({
            success: false,
            error: {message: expect.any(String)},
        });
    });

    test('should throw a 401 error status and clear the cookie when an access token is sent as the refresh cookie', async () => {
        await prisma.user.create({
            data: {
                ...createUserDtoObj,
                password: BCryptAdapter.hash(createUserDtoObj.password),
            },
        });
        const loginResponse = await request(testServer.app)
            .post('/api/auth/login')
            .send(loginUserDtoObj)
            .expect(200);
        const accessToken = loginResponse.body.data.token;

        const response = await request(testServer.app)
            .post('/api/auth/refresh')
            .set('Cookie', `refreshToken=${accessToken}`)
            .expect(401);

        expect(response.body).toEqual({
            success: false,
            error: {message: ERROR_MESSAGES.TOKEN.INVALID},
        });
        expect(response.headers['set-cookie'][0]).toContain('refreshToken=;');
    });
});
