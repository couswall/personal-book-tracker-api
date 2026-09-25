import {IBookshelfCount, IShelfBook} from '@domain/interfaces/bookshelf.interfaces';
import {IReadingChallengeGoalProgress} from '@domain/interfaces/readingChallenge.interfaces';

export type IWantToReadBook = Pick<
    IShelfBook,
    'bookshelfBookId' | 'apiBookId' | 'title' | 'coverImageUrl'
>;

/** A few books of a shelf; `total` is how many the shelf holds. */
export interface IShelfPreview<T> {
    total: number;
    books: T[];
}

export interface IDashboardReadingChallenge {
    year: number;
    goal: number | null;
    booksRead: number;
    booksThisMonth: number;
    progress: IReadingChallengeGoalProgress | null;
}

export interface IDashboard {
    shelves: IBookshelfCount[];
    currentlyReading: IShelfPreview<IShelfBook>;
    wantToRead: IShelfPreview<IWantToReadBook>;
    readingChallenge: IDashboardReadingChallenge;
}
