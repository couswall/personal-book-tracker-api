import {Request, Response} from 'express';
import {CustomError} from '@domain/errors/custom.error';
import {AddToBookshelfDto} from '@domain/dtos';
import {BookshelfBookRepository} from '@domain/repositories/bookshelfBook.repository';
import {BookRepository} from '@domain/repositories/book.repository';
import {AddToBookshelf, UpdateBookshelf} from '@domain/use-cases';
import {BookshelfRepository} from '@domain/repositories/bookshelf.repository';
import {UpdateBookshelfDto} from '@domain/dtos/bookshelfBook/updateBookshelf-bookshelfBook.dto';

export class BookshelfBookController {
    constructor(
        private readonly repository: BookshelfBookRepository,
        private readonly bookRepository: BookRepository,
        private readonly bookshelfRepository: BookshelfRepository
    ) {}

    public addToBookshelf = (req: Request, res: Response) => {
        const [errorMsg, dto] = AddToBookshelfDto.create(req.body);
        if (errorMsg || !dto) {
            res.status(400).json({
                success: false,
                error: {message: errorMsg},
            });
            return;
        }

        new AddToBookshelf(this.repository, this.bookRepository, this.bookshelfRepository)
            .execute(dto)
            .then((bookshelfBook) => {
                const {deletedAt, ...rest} = bookshelfBook;
                res.status(201).json({
                    success: true,
                    message: 'Bookshelf Book added to bookshelf',
                    data: {bookshelfBook: {...rest}},
                });
            })
            .catch((error) => CustomError.handleError(error, res));
    };

    public updateBookshelf = (req: Request, res: Response) => {
        const [errorMsg, dto] = UpdateBookshelfDto.create(req.body);
        if (errorMsg || !dto) {
            res.status(400).json({
                success: false,
                error: {message: errorMsg},
            });
            return;
        }

        new UpdateBookshelf(
            this.repository,
            this.bookRepository,
            this.bookshelfRepository
        )
            .execute(dto)
            .then((bookshelfBook) => {
                const {deletedAt, ...rest} = bookshelfBook;
                res.status(200).json({
                    success: true,
                    message: 'Bookshelf book updated successfully',
                    data: {bookshelfBook: {...rest}},
                });
            })
            .catch((error) => CustomError.handleError(error, res));
    };
}
