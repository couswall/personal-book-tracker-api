import request from 'supertest';
import {prisma} from '@data/postgres';
import {testServer} from '@tests/test-server';
import {BCryptAdapter} from '@config/bcrypt.adapter';
import {setupAuthRoutes} from '@tests/presentation/auth/routes/setup';
import {createUserDtoObj, loginUserDtoObj} from '@tests/fixtures';

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

        const {body} = await agent.post('/api/auth/refresh').expect(200);

        expect(body.data.token).toEqual(expect.any(String));
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

    test('should throw a 401 error status when an access token is sent as the refresh cookie', async () => {
        const {body} = await request(testServer.app)
            .post('/api/auth/refresh')
            .expect(401);

        expect(body).toEqual({
            success: false,
            error: {message: expect.any(String)},
        });
    });
});
