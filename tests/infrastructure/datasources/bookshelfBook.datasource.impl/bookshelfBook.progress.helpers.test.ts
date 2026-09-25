import {IShelfBookProgress} from '@domain/interfaces/bookshelfBook.interfaces';
import {toReadingProgress} from '@infrastructure/datasources/bookshelfBook/bookshelfBook.progress.helpers';

describe('bookshelfBook progress helpers', () => {
    describe('toReadingProgress()', () => {
        test('should expose the progress of the currently reading book', () => {
            const progress: IShelfBookProgress = {
                readingProgress: 40,
                currentPage: 120,
                progressType: 'PAGE',
            };

            expect(toReadingProgress(progress)).toEqual(progress);
        });

        test('should return null fields when there is no currently reading book', () => {
            expect(toReadingProgress(undefined)).toEqual({
                readingProgress: null,
                currentPage: null,
                progressType: null,
            });
        });
    });
});
