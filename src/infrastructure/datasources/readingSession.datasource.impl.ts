import {prisma} from '@data/postgres';
import {ReadingSessionDatasource} from '@domain/datasources/readingSession.datasource';
import {ReadingSessionEntity} from '@domain/entities';
import {ICreateReadingSession} from '@domain/interfaces/readingSession.interfaces';

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
}
