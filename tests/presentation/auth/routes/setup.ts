import {prisma} from '@data/postgres';
import {testServer} from '@tests/test-server';

export const setupAuthRoutes = () => {
    beforeAll(async () => {
        await testServer.start();
    });

    afterAll(() => {
        testServer.close();
    });

    beforeEach(async () => {
        await prisma.user.deleteMany();
        await prisma.bookshelf.deleteMany();
    });
};
