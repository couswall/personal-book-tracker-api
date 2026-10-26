import {BookshelfBookEntity} from '@domain/entities';
import {
    AddToBookshelfDto,
    UpdateBookshelfDto,
    RemoveFromBookshelfDto,
    UpdateReadingProgressDto,
} from '@domain/dtos';

export interface AddToBookshelfUseCase {
    execute(
        addToBookshelfDto: AddToBookshelfDto,
        userId: number
    ): Promise<BookshelfBookEntity>;
}

export interface UpdateBookshelfUseCase {
    execute(
        updateBookshelfDto: UpdateBookshelfDto,
        userId: number
    ): Promise<BookshelfBookEntity>;
}

export interface RemoveFromBookshelfUseCase {
    execute(
        removeFromBookshelfDto: RemoveFromBookshelfDto,
        userId: number
    ): Promise<BookshelfBookEntity>;
}

export interface UpdateReadingProgressUseCase {
    execute(
        updateReadingProgressDto: UpdateReadingProgressDto,
        userId: number
    ): Promise<BookshelfBookEntity>;
}
