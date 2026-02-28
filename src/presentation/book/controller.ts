import { Request, Response } from "express";
import { GetBookByIdDto, SearchBookDto } from "@domain/dtos/index";
import { BookRepository } from "@domain/repositories/book.repository";
import { SearchBook, GetBookById } from "@domain/use-cases/index";
import { CustomError } from "@domain/errors/custom.error";
import { PrintTypeEnum } from "@domain/interfaces/book.interfaces";

export class BookController{
    constructor(
        private readonly reposiotry: BookRepository,
    ){};

    public searchBook = (req: Request, res: Response) => {
        const {searchText, page, printType, maxResults} = req.query;
        const queryDto = {
            searchText: searchText as string,
            page: page ? +page : undefined,
            printType: printType as PrintTypeEnum,
            maxResults: maxResults ? +maxResults : undefined,
        };
        
        const [errorMsg, dto] = SearchBookDto.create(queryDto);
        if (errorMsg) {
            res.status(400).json({
                success: false,
                error: {message: errorMsg}
            });
            return;
        }

        new SearchBook(this.reposiotry)
            .execute(dto!)
            .then(data => res.status(200).json({
                success: true,
                message: 'Searching books successfully',
                data,
            }))
            .catch(error => CustomError.handleError(error, res));
    };

    public getBookById = (req: Request, res: Response) => {
        const [errorMsg, dto] = GetBookByIdDto.create(req.params.bookId);
        if(errorMsg){
            res.status(400).json({
                success: false,
                error: {message: errorMsg}
            });
            return;
        }

        new GetBookById(this.reposiotry)
            .execute(dto!)
            .then(bookEntity => {
                const {bookshelves, reviews, notes, ...rest} = bookEntity;
                res.status(200).json({
                    success: true,
                    message: 'Getting book details successfully',
                    data: {...rest},
                })
            })
            .catch(error => CustomError.handleError(error, res));
    };
}