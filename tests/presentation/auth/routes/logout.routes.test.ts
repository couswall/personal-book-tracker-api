import request from 'supertest';
import {prisma} from '@data/postgres';
import {testServer} from '@tests/test-server';
import {BCryptAdapter} from '@config/bcrypt.adapter';
import {setupAuthRoutes} from '@tests/presentation/auth/routes/setup';
import {createUserDtoObj, loginUserDtoObj} from '@tests/fixtures';

describe('/api/auth/logout endpoint', () => {
    setupAuthRoutes();

    test('should return a 200 status and clear the refresh cookie', async () => {
        const response = await request(testServer.app)
            .post('/api/auth/logout')
            .expect(200);
        expect(response.headers['set-cookie'][0]).toContain('refreshToken=;');
    });

    test('should throw a 401 error status on refresh after logout', async () => {
        await prisma.user.create({
            data: {
                ...createUserDtoObj,
                password: BCryptAdapter.hash(createUserDtoObj.password),
            },
        });

        const agent = request.agent(testServer.app);

        await agent.post('/api/auth/login').send(loginUserDtoObj).expect(200);
        await agent.post('/api/auth/logout').expect(200);

        const {body} = await agent.post('/api/auth/refresh').expect(401);

        expect(body).toEqual({
            success: false,
            error: {message: expect.any(String)},
        });
    });
});
