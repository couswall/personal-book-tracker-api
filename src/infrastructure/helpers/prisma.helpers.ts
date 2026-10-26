import {Prisma} from '@/generated/prisma';

/** True when Prisma rejected the query with the given error code (e.g. P2002, P2025). */
export const isPrismaError = (error: unknown, code: string): boolean =>
    error instanceof Prisma.PrismaClientKnownRequestError && error.code === code;
