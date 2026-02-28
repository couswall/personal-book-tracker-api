import { Request, Response } from "express";
import { CustomError } from "@domain/errors/custom.error";
import { CreateCustomBookShelfDto } from "@domain/dtos/index";
import { BookshelfRepository } from "@domain/repositories/bookshelf.repository";
import { UserRepository } from "@domain/repositories/user.repository";
import { GetMyBookShelves, CreateCustom } from "@domain/use-cases/index";

export class BookshelfController{
    constructor(
        private readonly repository: BookshelfRepository,
        private readonly userRepository: UserRepository,
    ){};

    public createCustom = (req: Request, res: Response) => {
        const [errorMsg, dto] = CreateCustomBookShelfDto.create(req.body);
        if(errorMsg || !dto){
            res.status(400).json({
                success: false,
                error: {message: errorMsg}
            });
            return;
        }

        new CreateCustom(this.repository, this.userRepository)
            .execute(dto)
            .then(bookshelf => res.status(201).json({
                success: true,
                message: 'Custom bookshelf created successfully',
                data: {
                    id: bookshelf.id,
                    name: bookshelf.name,
                    type: bookshelf.type,
                },
            }))
            .catch(error => CustomError.handleError(error, res))

    };

    public getMyBookshelves = (req: Request, res: Response) => {
        const userId = +req.params.userId;
        if(!userId || isNaN(userId)){
            res.status(400).json({
                success: false,
                error: {message: 'userId is mandatory and must be a number'}
            });
            return;
        }

        new GetMyBookShelves(this.repository, this.userRepository)
            .execute(userId)
            .then(bookshelves => res.status(200).json({
                success: true,
                message: 'Successfully fetched bookshelves.',
                data: bookshelves.map(bookshelf => {
                    const {deletedAt, userId,books, ...rest} = bookshelf;
                    return {...rest};
                }),
            }))
            .catch(error => CustomError.handleError(error, res));
    }
}