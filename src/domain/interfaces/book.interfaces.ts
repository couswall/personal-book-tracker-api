import { BookshelfBookEntity, NoteEntity, ReviewEntity } from "@domain/entities";

export interface ISearchGoogleBook{
    id: string;
    title: string;
    authors: string[];
    imageCover?: string;
};

export enum PrintTypeEnum {
    All = 'all',
    Books = 'books',
    Magazines = 'magazines',
};

export interface ISearchBookDto{
    searchText?: string;
    page?: number;
    printType?: PrintTypeEnum;
    maxResults?: number;
};

export interface ISearchBookResponse{
    page: number;
    maxResults: number;
    books: ISearchGoogleBook[];
}

export interface ICreateBookEntityFromObject{
    id: number;
    apiBookId: string;
    title: string;
    subtitle: string | null;
    authors: string[];
    description: string | null;
    pageCount: number;
    publishedDate: Date | null;
    coverImageUrl: string | null;
    categories: string[];
    averageRating: number | null;
    reviewCount: number;
    deletedAt: Date | null;
    bookshelves?: BookshelfBookEntity[];
    reviews?: ReviewEntity[];
    notes?: NoteEntity[];
}

export interface ICreateBookDtoObj{
    apiBookId: string;
    title: string;
    subtitle: string | null;
    authors: string[];
    description: string | null;
    publishedDate: Date | null;
    coverImageUrl: string | null;
    categories: string[];
    averageRating: number;
    reviewCount: number;
    pageCount: number;
}