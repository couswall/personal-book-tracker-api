import {prisma} from '@tests/setup';
import {Prisma} from '@/generated/prisma';
import {CustomError} from '@domain/errors/custom.error';
import {ReadingChallengeEntity} from '@domain/entities';
import {ReadingChallengeDatasourceImpl} from '@infrastructure/datasources/readingChallenge.datasource.impl';
import {ERROR_MESSAGES} from '@infrastructure/constants';
import {
    readingChallengeData,
    readingChallengeKey,
    readingChallengeObject,
} from '@tests/fixtures';

const prismaError = (code: string) =>
    new Prisma.PrismaClientKnownRequestError('Prisma error', {
        code,
        clientVersion: '0.0.0',
    });

describe('readingChallenge.datasource.impl tests', () => {
    const datasource = new ReadingChallengeDatasourceImpl();
    const {ALREADY_EXISTS, NOT_FOUND} = ERROR_MESSAGES.READING_CHALLENGE;
    const where = {userId_year: readingChallengeKey};

    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('create()', () => {
        test('should create the challenge and return a ReadingChallengeEntity', async () => {
            (prisma.readingChallenge.create as jest.Mock).mockResolvedValue(
                readingChallengeObject
            );

            const result = await datasource.create(readingChallengeData);

            expect(result).toBeInstanceOf(ReadingChallengeEntity);
            expect(prisma.readingChallenge.create).toHaveBeenCalledWith({
                data: readingChallengeData,
            });
        });

        test('should throw ALREADY_EXISTS when the user already has a challenge that year', async () => {
            (prisma.readingChallenge.create as jest.Mock).mockRejectedValue(
                prismaError('P2002')
            );

            await expect(datasource.create(readingChallengeData)).rejects.toThrow(
                CustomError.badRequest(ALREADY_EXISTS)
            );
        });

        test('should rethrow unknown errors', async () => {
            (prisma.readingChallenge.create as jest.Mock).mockRejectedValue(
                new Error('DB error')
            );

            await expect(datasource.create(readingChallengeData)).rejects.toThrow(
                'DB error'
            );
        });
    });

    describe('update()', () => {
        test('should update the goal of the user challenge for that year', async () => {
            (prisma.readingChallenge.update as jest.Mock).mockResolvedValue(
                readingChallengeObject
            );

            const result = await datasource.update(readingChallengeData);

            expect(result).toBeInstanceOf(ReadingChallengeEntity);
            expect(prisma.readingChallenge.update).toHaveBeenCalledWith({
                where,
                data: {goal: readingChallengeData.goal},
            });
        });

        test('should throw NOT_FOUND (404) when the challenge does not exist', async () => {
            (prisma.readingChallenge.update as jest.Mock).mockRejectedValue(
                prismaError('P2025')
            );

            await expect(datasource.update(readingChallengeData)).rejects.toMatchObject({
                statusCode: 404,
                message: NOT_FOUND,
            });
        });

        test('should rethrow unknown errors', async () => {
            (prisma.readingChallenge.update as jest.Mock).mockRejectedValue(
                new Error('DB error')
            );

            await expect(datasource.update(readingChallengeData)).rejects.toThrow(
                'DB error'
            );
        });
    });

    describe('delete()', () => {
        test('should delete the user challenge for that year', async () => {
            (prisma.readingChallenge.delete as jest.Mock).mockResolvedValue(
                readingChallengeObject
            );

            const result = await datasource.delete(readingChallengeKey);

            expect(result).toBeInstanceOf(ReadingChallengeEntity);
            expect(prisma.readingChallenge.delete).toHaveBeenCalledWith({where});
        });

        test('should throw NOT_FOUND (404) when the challenge does not exist', async () => {
            (prisma.readingChallenge.delete as jest.Mock).mockRejectedValue(
                prismaError('P2025')
            );

            await expect(datasource.delete(readingChallengeKey)).rejects.toMatchObject({
                statusCode: 404,
                message: NOT_FOUND,
            });
        });

        test('should rethrow unknown errors', async () => {
            (prisma.readingChallenge.delete as jest.Mock).mockRejectedValue(
                new Error('DB error')
            );

            await expect(datasource.delete(readingChallengeKey)).rejects.toThrow(
                'DB error'
            );
        });
    });
});
