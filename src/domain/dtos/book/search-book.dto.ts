import { isValidRequiredNumber, isValidString } from "@domain/dtos/book/helpers";
import { BOOK_DTO_ERRORS } from "@domain/constants/book.constants";
import { INVALID_OBJECT_ERROR } from "@domain/constants/bookshelfBook.constants";
import { ISearchBookDto, PrintTypeEnum } from "@domain/interfaces/book.interfaces";


export class SearchBookDto{
    constructor(
        public readonly searchText: string,
        public readonly page: number = 1,
        public readonly printType: PrintTypeEnum = PrintTypeEnum.Books,
        public readonly maxResults: number = 10,
    ){};

    static create(object: ISearchBookDto | undefined): [string?, SearchBookDto?]{
        if(!object) return [INVALID_OBJECT_ERROR];
        let {searchText, page, printType, maxResults} = object;
        
        const [searchTextError, trimmedSearchText = ''] = isValidString('searchText', searchText, 1, 50, true);
        if(searchTextError) return [searchTextError]
        searchText = trimmedSearchText;

        const [pageError, parsedPage] = isValidRequiredNumber('page', page, true);
        if(pageError) return[pageError];
        page = parsedPage;

        if(printType && !Object.values(PrintTypeEnum).includes(printType)) 
            return [BOOK_DTO_ERRORS.SEARCH_BOOK.PRINT_TYPE.TYPE];
        
        const [maxResultError, parsedMaxResult] = isValidRequiredNumber('maxResults', maxResults, true);
        if(maxResultError) return[maxResultError];
        maxResults = parsedMaxResult;

        return [undefined, new SearchBookDto(searchText, page, printType, maxResults)];
    };
}