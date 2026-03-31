import { BookshelfBookEntity } from "@domain/entities";
import { AddToBookshelfDto, UpdateBookshelfDto, RemoveFromBookshelfDto } from '@domain/dtos';

export interface AddToBookshelfUseCase{
    execute(addToBookshelfDto: AddToBookshelfDto): Promise<BookshelfBookEntity>;
}

export interface UpdateBookshelfUseCase{
    execute(updateBookshelfDto: UpdateBookshelfDto): Promise<BookshelfBookEntity>;
}

export interface RemoveFromBookshelfUseCase{
    execute(removeFromBookshelfDto: RemoveFromBookshelfDto): Promise<BookshelfBookEntity>;
}