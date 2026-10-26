import {BookshelfType} from '@/generated/prisma';
import {IBookshelfCount, IShelfBook} from '@domain/interfaces/bookshelf.interfaces';
import {
    IDashboardReadingChallenge,
    IWantToReadBook,
} from '@domain/interfaces/dashboard.interfaces';
import {IReadingChallengeProgress} from '@domain/interfaces/readingChallenge.interfaces';

export const getShelfTotal = (shelves: IBookshelfCount[], type: BookshelfType): number =>
    shelves.find((shelf) => shelf.type === type)?.bookCount ?? 0;

export const toWantToReadBook = ({
    bookshelfBookId,
    apiBookId,
    title,
    coverImageUrl,
}: IShelfBook): IWantToReadBook => ({bookshelfBookId, apiBookId, title, coverImageUrl});

/** Drops the per-book and per-month lists the dashboard doesn't show. */
export const toDashboardChallenge = (
    {year, goal, booksRead, monthly, progress}: IReadingChallengeProgress,
    now: Date
): IDashboardReadingChallenge => ({
    year,
    goal,
    booksRead,
    booksThisMonth: monthly[now.getUTCMonth()],
    progress,
});
