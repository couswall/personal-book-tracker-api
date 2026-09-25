jest.mock('@data/postgres', () => {
    const mockPrisma: Record<string, unknown> = {
        book: {
            findFirst: jest.fn(),
            findUnique: jest.fn(),
            create: jest.fn(),
        },
        bookshelfBook: {
            findFirst: jest.fn(),
            findUnique: jest.fn(),
            findMany: jest.fn(),
            create: jest.fn(),
            update: jest.fn(),
            delete: jest.fn(),
        },
        bookshelf: {
            findUnique: jest.fn(),
            findFirst: jest.fn(),
            findMany: jest.fn(),
            createMany: jest.fn(),
        },
        user: {
            findFirst: jest.fn(),
            create: jest.fn(),
        },
        readingSession: {
            findFirst: jest.fn(),
            findMany: jest.fn(),
            create: jest.fn(),
            update: jest.fn(),
            count: jest.fn(),
        },
        readingChallenge: {
            create: jest.fn(),
            update: jest.fn(),
            delete: jest.fn(),
            findUnique: jest.fn(),
            findMany: jest.fn(),
        },
    };
    mockPrisma.$transaction = jest.fn((callback: (tx: unknown) => unknown) =>
        callback(mockPrisma)
    );

    return {prisma: mockPrisma};
});

import {prisma} from '@data/postgres';
export {prisma};
