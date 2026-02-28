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
        },
        bookshelf: {
            findUnique: jest.fn(),
        },
    },
}));

import {prisma} from '@data/postgres';
export {prisma};
