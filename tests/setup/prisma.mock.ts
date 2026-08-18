jest.mock('@data/postgres', () => ({
    prisma: {
        book: {
            findFirst: jest.fn(),
            findUnique: jest.fn(),
            create: jest.fn(),
        },
        bookshelfBook: {
            findFirst: jest.fn(),
            findUnique: jest.fn(),
            create: jest.fn(),
            update: jest.fn(),
            delete: jest.fn(),
        },
        $transaction: jest.fn(),
        bookshelf: {
            findUnique: jest.fn(),
            createMany: jest.fn(),
        },
        user: {
            findFirst: jest.fn(),
            create: jest.fn(),
        },
        readingSession: {
            findFirst: jest.fn(),
            create: jest.fn(),
        },
    },
}));

import {prisma} from '@data/postgres';
export {prisma};
