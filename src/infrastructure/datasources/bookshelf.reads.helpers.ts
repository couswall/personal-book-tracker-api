import {prisma} from '@data/postgres';
import {IBookRead} from '@domain/interfaces/bookshelf.interfaces';

/** Every finish of the book (newest first), flagged when its UTC year has a reading challenge. */
export const findBookReads = async (
    userId: number,
    bookId: number
): Promise<IBookRead[]> => {
    const sessions = await prisma.readingSession.findMany({
        where: {userId, bookId, finishedAt: {not: null}, deletedAt: null},
        orderBy: {finishedAt: 'desc'},
        select: {finishedAt: true},
    });
    const finishDates = sessions.flatMap(({finishedAt}) =>
        finishedAt ? [finishedAt] : []
    );
    if (finishDates.length === 0) return [];

    const years = [...new Set(finishDates.map((date) => date.getUTCFullYear()))];
    const challenges = await prisma.readingChallenge.findMany({
        where: {userId, year: {in: years}},
        select: {year: true},
    });
    const challengeYears = new Set(challenges.map(({year}) => year));

    return finishDates.map((finishedAt) => ({
        finishedAt,
        hasChallenge: challengeYears.has(finishedAt.getUTCFullYear()),
    }));
};
