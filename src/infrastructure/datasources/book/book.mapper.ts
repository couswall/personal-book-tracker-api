import {ICreateBookEntityFromObject} from '@domain/interfaces/book.interfaces';
import {IBookFromAPI} from '@domain/interfaces/apiBook.interfaces';

export const resolveImageUrl = (
    imageLinks: IBookFromAPI['volumeInfo']['imageLinks']
): string | undefined =>
    imageLinks?.extralarge ??
    imageLinks?.large ??
    imageLinks?.medium ??
    imageLinks?.thumbnail ??
    imageLinks?.smallThumbnail;

export const parseDateIfValid = (dateString: string | undefined): Date | null => {
    if (!dateString || dateString.length === 0) return null;
    return new Date(dateString);
};

export const mapApiBookToObject = (
    googleBook: IBookFromAPI
): ICreateBookEntityFromObject => {
    const {id: apiBookId, volumeInfo} = googleBook;
    return {
        id: 0,
        apiBookId,
        title: volumeInfo.title,
        subtitle: volumeInfo.subtitle ?? null,
        authors: volumeInfo.authors ?? [],
        publishedDate: parseDateIfValid(volumeInfo.publishedDate),
        description: volumeInfo.description ?? null,
        coverImageUrl: resolveImageUrl(volumeInfo.imageLinks) ?? null,
        categories: volumeInfo.categories ?? [],
        pageCount: volumeInfo.pageCount ?? 0,
        averageRating: volumeInfo.averageRating ?? 0,
        reviewCount: volumeInfo.ratingsCount ?? 0,
        deletedAt: null,
    };
};
