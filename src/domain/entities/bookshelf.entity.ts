import {BookshelfType} from '@prisma/client';
import {UserEntity} from '@domain/entities/user.entity';
import {ICreateBookshelfEntity} from '@domain/interfaces/bookshelf.interfaces';

export class BookshelfEntity {
    constructor(
        public id: number,
        public name: string,
        public type: BookshelfType = 'CUSTOM',
        public userId: number,
        public books: BookshelfEntity[] = [],
        public deletedAt: Date | null,
        public user?: UserEntity
    ) {}

    public static fromObject(object: ICreateBookshelfEntity): BookshelfEntity {
        return new BookshelfEntity(
            object.id,
            object.name,
            object.type,
            object.userId,
            object.books,
            object.deletedAt,
            object.user
        );
    }

    public static convertArray(array: ICreateBookshelfEntity[]): BookshelfEntity[] {
        return array.map((bookshelf) => this.fromObject(bookshelf));
    }
}
