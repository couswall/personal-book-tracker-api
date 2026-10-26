import {AxiosError} from 'axios';
import {prisma} from '@data/postgres';
import {envs} from '@config/index';
import {CustomError} from '@domain/errors/custom.error';
import {BookDatasource} from '@domain/datasources/book.datasource';
import {CreateBookDto, GetBookByIdDto, SearchBookDto} from '@domain/dtos/index';
import {BookEntity} from '@domain/entities/book.entity';
import {
    mapApiBookToObject,
    resolveImageUrl,
} from '@infrastructure/datasources/book/book.mapper';
import {ERROR_MESSAGES} from '@infrastructure/constants';
import {ISearchBookResponse} from '@domain/interfaces/book.interfaces';
import {
    IBookFromAPI,
    ISearchFromAPIResponse,
} from '@domain/interfaces/apiBook.interfaces';
import {HttpClient} from '@config/interfaces';

export class BookDatasourceImpl implements BookDatasource {
    constructor(private readonly http: HttpClient) {}

    async search(searchBookDto: SearchBookDto): Promise<ISearchBookResponse> {
        const params = {
            q: searchBookDto.searchText,
            startIndex: (searchBookDto.page - 1) * searchBookDto.maxResults,
            printType: searchBookDto.printType,
            maxResults: searchBookDto.maxResults,
            key: envs.GOOGLE_BOOKS_API_KEY,
        };

        try {
            const data = await this.http.get<ISearchFromAPIResponse>(
                `${envs.BOOKS_API}/volumes`,
                {params}
            );

            if (data.totalItems === 0 || !data.items)
                return {
                    page: searchBookDto.page,
                    maxResults: searchBookDto.maxResults,
                    books: [],
                };

            const formatBooks = data.items.map((googleBook) => ({
                id: googleBook.id,
                title: googleBook.volumeInfo.title,
                authors: googleBook.volumeInfo.authors,
                imageCover: resolveImageUrl(googleBook.volumeInfo.imageLinks),
                averageRating: googleBook.volumeInfo.averageRating ?? 0,
                reviewCount: googleBook.volumeInfo.ratingsCount ?? 0,
            }));

            return {
                page: searchBookDto.page,
                maxResults: searchBookDto.maxResults,
                books: formatBooks,
            };
        } catch {
            throw CustomError.internalServer(ERROR_MESSAGES.EXTERNAL_BOOKS_API.INTERNAL);
        }
    }

    async getBookById(getBookByIdDto: GetBookByIdDto): Promise<BookEntity> {
        const {bookId} = getBookByIdDto;
        const isNumericId = !isNaN(Number(bookId));
        const existingBook = await prisma.book.findFirst({
            where: isNumericId
                ? {id: Number(bookId), deletedAt: null}
                : {apiBookId: bookId, deletedAt: null},
        });

        if (!existingBook) return this.fetchByIdFromAPI(getBookByIdDto);
        return BookEntity.fromObject(existingBook);
    }

    async fetchByIdFromAPI(getBookByIdDto: GetBookByIdDto): Promise<BookEntity> {
        const {bookId} = getBookByIdDto;
        const params = {key: envs.GOOGLE_BOOKS_API_KEY};

        try {
            const googleBook = await this.http.get<IBookFromAPI>(
                `${envs.BOOKS_API}/volumes/${bookId}`,
                {params}
            );
            return BookEntity.fromObject(mapApiBookToObject(googleBook));
        } catch (error) {
            if (error instanceof AxiosError) {
                const code: number = error.response?.data?.error?.code ?? 0;
                if (code === 503)
                    throw CustomError.badRequest(
                        ERROR_MESSAGES.BOOK.GET_BOOK_BY_ID.NOT_FOUND
                    );
            }
            throw CustomError.internalServer(ERROR_MESSAGES.EXTERNAL_BOOKS_API.INTERNAL);
        }
    }

    async create(createBookDto: CreateBookDto): Promise<BookEntity> {
        const existingBook = await prisma.book.findUnique({
            where: {apiBookId: createBookDto.apiBookId, deletedAt: null},
        });
        if (existingBook)
            throw CustomError.badRequest(ERROR_MESSAGES.BOOK.CREATE.EXISTING);

        const newBook = await prisma.book.create({data: createBookDto});

        return BookEntity.fromObject(newBook);
    }

    async findOrCreateByApiId(apiBookId: string): Promise<BookEntity> {
        let book = await this.getBookById({bookId: apiBookId});

        if (book.id === 0) {
            const {
                id: _id,
                bookshelves: _bookshelves,
                reviews: _reviews,
                notes: _notes,
                deletedAt: _deletedAt,
                ...rest
            } = book;
            const [error, dto] = CreateBookDto.create(rest);
            if (error) throw CustomError.badRequest(error);
            if (!dto)
                throw CustomError.internalServer(
                    ERROR_MESSAGES.EXTERNAL_BOOKS_API.INTERNAL
                );
            const newBook = await this.create(dto);
            book = newBook;
        }

        return book;
    }
}
