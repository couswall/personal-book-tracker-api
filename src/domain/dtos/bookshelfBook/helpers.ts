import {ReadingProgressType} from '@domain/interfaces/bookshelfBook.interfaces';

export const isReadingProgressType = (value?: string): value is ReadingProgressType =>
    value === 'PAGE' || value === 'PERCENTAGE';
