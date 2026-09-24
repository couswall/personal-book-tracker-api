import {prisma} from '@data/postgres';
import {Prisma} from '@/generated/prisma';
import {CustomError} from '@domain/errors/custom.error';
import {ReadingChallengeEntity} from '@domain/entities';
import {ReadingChallengeDatasource} from '@domain/datasources/readingChallenge.datasource';
import {
    IReadingChallengeData,
    IReadingChallengeKey,
} from '@domain/interfaces/readingChallenge.interfaces';
import {ERROR_MESSAGES} from '@infrastructure/constants';

const {ALREADY_EXISTS, NOT_FOUND} = ERROR_MESSAGES.READING_CHALLENGE;

const isPrismaError = (error: unknown, code: string): boolean =>
    error instanceof Prisma.PrismaClientKnownRequestError && error.code === code;

export class ReadingChallengeDatasourceImpl implements ReadingChallengeDatasource {
    async create(data: IReadingChallengeData): Promise<ReadingChallengeEntity> {
        try {
            const challenge = await prisma.readingChallenge.create({data});
            return ReadingChallengeEntity.fromObject(challenge);
        } catch (error) {
            if (isPrismaError(error, 'P2002'))
                throw CustomError.badRequest(ALREADY_EXISTS);
            throw error;
        }
    }

    async update({
        userId,
        year,
        goal,
    }: IReadingChallengeData): Promise<ReadingChallengeEntity> {
        try {
            const challenge = await prisma.readingChallenge.update({
                where: {userId_year: {userId, year}},
                data: {goal},
            });
            return ReadingChallengeEntity.fromObject(challenge);
        } catch (error) {
            if (isPrismaError(error, 'P2025')) throw CustomError.notFound(NOT_FOUND);
            throw error;
        }
    }

    async delete({userId, year}: IReadingChallengeKey): Promise<ReadingChallengeEntity> {
        try {
            const challenge = await prisma.readingChallenge.delete({
                where: {userId_year: {userId, year}},
            });
            return ReadingChallengeEntity.fromObject(challenge);
        } catch (error) {
            if (isPrismaError(error, 'P2025')) throw CustomError.notFound(NOT_FOUND);
            throw error;
        }
    }

    async findByYear({
        userId,
        year,
    }: IReadingChallengeKey): Promise<ReadingChallengeEntity | null> {
        const challenge = await prisma.readingChallenge.findUnique({
            where: {userId_year: {userId, year}},
        });
        return challenge ? ReadingChallengeEntity.fromObject(challenge) : null;
    }

    async findAllByUser(userId: number): Promise<ReadingChallengeEntity[]> {
        const challenges = await prisma.readingChallenge.findMany({
            where: {userId},
            orderBy: {year: 'desc'},
        });
        return challenges.map((challenge) =>
            ReadingChallengeEntity.fromObject(challenge)
        );
    }
}
