import { BookshelfBookEntity } from "@domain/entities/bookshelfBook.entity";
import {NoteEntity, ReviewEntity} from '@domain/entities/index';
import { ICreateBookEntityFromObject } from "@domain/interfaces/book.interfaces";

export class BookEntity{
    constructor(
        public id: number,
        public apiBookId: string,
        public title: string,
        public authors: string[],
        public description: string | null,
        public publishedDate: Date | null,
        public coverImageUrl: string | null,
        public categories: string[],
        public pageCount: number,
        public averageRating: number = 0,
        public reviewCount: number = 0,
        public subtitle: string | null = null,
        public bookshelves: BookshelfBookEntity[] = [],
        public reviews: ReviewEntity[] = [],
        public notes: NoteEntity[] = [],
        public deletedAt: Date | null = null,
    ){};

    public static fromObject(object: ICreateBookEntityFromObject): BookEntity{
        return new BookEntity(
            object.id,
            object.apiBookId,
            object.title,
            object.authors,
            object.description,
            object.publishedDate,
            object.coverImageUrl,
            object.categories,
            object.pageCount,
            object.averageRating ?? 0,
            object.reviewCount,
            object.subtitle,
            object.bookshelves,
            object.reviews,
            object.notes,
            object.deletedAt,
        );
    }
}