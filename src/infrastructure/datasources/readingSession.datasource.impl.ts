import {prisma} from '@data/postgres';
import {ReadingSessionDatasource} from '@domain/datasources/readingSession.datasource';
import {ReadingSessionEntity} from '@domain/entities';
import {
    ICreateReadingSession,
    IDateRange,
    IFinishedReading,
    IFinishSessionDates,
} from '@domain/interfaces/readingSession.interfaces';

export class ReadingSessionDatasourceImpl implements ReadingSessionDatasource {
    async findOpenSession(
        userId: number,
        bookId: number
    ): Promise<ReadingSessionEntity | null> {
        const session = await prisma.readingSession.findFirst({
            where: {userId, bookId, finishedAt: null, deletedAt: null},
        });
        return session ? ReadingSessionEntity.fromObject(session) : null;
    }

    async createSession(data: ICreateReadingSession): Promise<ReadingSessionEntity> {
        const session = await prisma.readingSession.create({data});
        return ReadingSessionEntity.fromObject(session);
    }

    async finishSession(
        sessionId: number,
        dates: IFinishSessionDates
    ): Promise<ReadingSessionEntity> {
        const session = await prisma.readingSession.update({
            where: {id: sessionId},
            data: dates,
        });
        return ReadingSessionEntity.fromObject(session);
    }

    async findLatestFinishedSession(
        userId: number,
        bookId: number
    ): Promise<ReadingSessionEntity | null> {
        const session = await prisma.readingSession.findFirst({
            where: {userId, bookId, finishedAt: {not: null}, deletedAt: null},
            orderBy: {finishedAt: 'desc'},
        });
        return session ? ReadingSessionEntity.fromObject(session) : null;
    }

    async discardSession(sessionId: number): Promise<ReadingSessionEntity> {
        const session = await prisma.readingSession.update({
            where: {id: sessionId},
            data: {deletedAt: new Date()},
        });
        return ReadingSessionEntity.fromObject(session);
    }

    async getFinishedInRange(
        userId: number,
        {from, to}: IDateRange
    ): Promise<IFinishedReading[]> {
        const sessions = await prisma.readingSession.findMany({
            where: {
                userId,
                deletedAt: null,
                finishedAt: {gte: from, lt: to},
            },
            select: {
                id: true,
                bookId: true,
                finishedAt: true,
                book: {
                    select: {
                        title: true,
                        coverImageUrl: true,
                    },
                },
            },
            orderBy: {finishedAt: 'asc'},
        });

        return sessions.flatMap(({id, bookId, finishedAt, book}) =>
            finishedAt ? [{sessionId: id, bookId, finishedAt, ...book}] : []
        );
    }

    async countFinishedInRange(userId: number, {from, to}: IDateRange): Promise<number> {
        return prisma.readingSession.count({
            where: {userId, deletedAt: null, finishedAt: {gte: from, lt: to}},
        });
    }
}
