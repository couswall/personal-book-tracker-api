import {ReadingProgressType} from '@domain/interfaces/bookshelfBook.interfaces';

const clampValue = (value: number, min: number, max: number | null): number => {
    const clampedMin = Math.max(value, min);
    return max === null ? clampedMin : Math.min(clampedMin, max);
};

export const computeProgress = (
    progressType: ReadingProgressType,
    value: number,
    totalPages: number | null,
    existingCurrentPage: number | null,
    existingReadingProgress: number
): {currentPage: number | null; readingProgress: number} => {
    if (progressType === 'PAGE') {
        const currentPage = clampValue(value, 0, totalPages);
        const readingProgress = totalPages
            ? Math.round((currentPage / totalPages) * 100)
            : existingReadingProgress;
        return {currentPage, readingProgress};
    }

    const readingProgress = clampValue(value, 0, 100);
    const currentPage = totalPages
        ? Math.round((readingProgress / 100) * totalPages)
        : existingCurrentPage;
    return {currentPage, readingProgress};
};
