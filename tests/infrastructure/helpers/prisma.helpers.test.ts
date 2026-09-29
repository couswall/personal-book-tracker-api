import {Prisma} from '@/generated/prisma';
import {isPrismaError} from '@infrastructure/helpers/prisma.helpers';

const prismaError = (code: string) =>
    new Prisma.PrismaClientKnownRequestError('Prisma error', {
        code,
        clientVersion: '0.0.0',
    });

describe('prisma helpers', () => {
    describe('isPrismaError()', () => {
        test('should be true for a Prisma error with the given code', () => {
            expect(isPrismaError(prismaError('P2002'), 'P2002')).toBe(true);
        });

        test('should be false for a Prisma error with a different code', () => {
            expect(isPrismaError(prismaError('P2025'), 'P2002')).toBe(false);
        });

        test('should be false for errors that are not from Prisma', () => {
            expect(isPrismaError(new Error('P2002'), 'P2002')).toBe(false);
            expect(isPrismaError({code: 'P2002'}, 'P2002')).toBe(false);
        });
    });
});
