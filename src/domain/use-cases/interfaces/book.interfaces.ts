import { GetBookByIdDto, SearchBookDto } from "@domain/dtos/index";
import { IGetBookByIdResponse, ISearchBookResponse } from "@domain/interfaces/book.interfaces";

export interface SearchBookUseCase{
    execute(searchBookDto: SearchBookDto): Promise<ISearchBookResponse>;
}

export interface GetBookByIdUseCase{
    execute(getBookByIdDto: GetBookByIdDto): Promise<IGetBookByIdResponse>;
}