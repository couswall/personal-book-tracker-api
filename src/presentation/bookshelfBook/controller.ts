import {Request, Response} from 'express';
import {CustomError} from '@domain/errors/custom.error';
import {AddToBookshelfDto} from '@domain/dtos';
import {BookshelfBookRepository} from '@domain/repositories/bookshelfBook.repository';
import {BookRepository} from '@domain/repositories/book.repository';
import {
    AddToBookshelf,
    UpdateBookshelf,
    RemoveFromBookshelf,
    UpdateReadingProgress,
} from '@domain/use-cases';
import {BookshelfRepository} from '@domain/repositories/bookshelf.repository';
import {ReadingSessionRepository} from '@domain/repositories/readingSession.repository';
import {UpdateBookshelfDto} from '@domain/dtos/bookshelfBook/updateBookshelf-bookshelfBook.dto';
import {RemoveFromBookshelfDto} from '@domain/dtos/bookshelfBook/removeFromBookshelf-bookshelfBook.dto';
import {UpdateReadingProgressDto} from '@domain/dtos/bookshelfBook/updateReadingProgress-bookshelfBook.dto';
import {requireAuthUserId} from '@presentation/helpers/auth.helpers';

export class BookshelfBookController {
    constructor(
        private readonly repository: BookshelfBookRepository,
        private readonly bookRepository: BookRepository,
        private readonly bookshelfRepository: BookshelfRepository,
        private readonly readingSessionRepository: ReadingSessionRepository
    ) {}

    public addToBookshelf = (req: Request, res: Response) => {
        const userId = requireAuthUserId(res);
        if (!userId) return;

        const [errorMsg, dto] = AddToBookshelfDto.create(req.body);
        if (errorMsg || !dto) {
            res.status(400).json({
                success: false,
                error: {message: errorMsg},
            });
            return;
        }

        new AddToBookshelf(
            this.repository,
            this.bookRepository,
            this.bookshelfRepository,
            this.readingSessionRepository
        )
            .execute(dto, userId)
            .then((bookshelfBook) => {
                res.status(201).json({
                    success: true,
                    message: 'Bookshelf Book added to bookshelf',
                    data: {bookshelfBook},
                });
            })
            .catch((error) => CustomError.handleError(error, res));
    };

    public updateBookshelf = (req: Request, res: Response) => {
        const userId = requireAuthUserId(res);
        if (!userId) return;

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
            this.bookshelfRepository,
            this.readingSessionRepository
        )
            .execute(dto, userId)
            .then((bookshelfBook) => {
                res.status(200).json({
                    success: true,
                    message: 'Bookshelf book updated successfully',
                    data: {bookshelfBook},
                });
            })
            .catch((error) => CustomError.handleError(error, res));
    };

    public removeFromBookshelf = (req: Request, res: Response) => {
        const userId = requireAuthUserId(res);
        if (!userId) return;

        const [errorMsg, dto] = RemoveFromBookshelfDto.create({
            bookshelfBookId: req.params.bookshelfBookId,
        });
        if (errorMsg || !dto) {
            res.status(400).json({
                success: false,
                error: {message: errorMsg},
            });
            return;
        }

        new RemoveFromBookshelf(this.repository, this.bookshelfRepository)
            .execute(dto, userId)
            .then(() =>
                res.status(200).json({
                    success: true,
                    message: 'Book removed from bookshelf successfully',
                })
            )
            .catch((error) => CustomError.handleError(error, res));
    };

    public updateReadingProgress = (req: Request, res: Response) => {
        const userId = requireAuthUserId(res);
        if (!userId) return;

        const [errorMsg, dto] = UpdateReadingProgressDto.create(req.body);
        if (errorMsg || !dto) {
            res.status(400).json({
                success: false,
                error: {message: errorMsg},
            });
            return;
        }

        new UpdateReadingProgress(
            this.repository,
            this.bookRepository,
            this.bookshelfRepository,
            this.readingSessionRepository
        )
            .execute(dto, userId)
            .then((bookshelfBook) => {
                res.status(200).json({
                    success: true,
                    message: 'Reading progress updated successfully',
                    data: {bookshelfBook},
                });
            })
            .catch((error) => CustomError.handleError(error, res));
    };
}
