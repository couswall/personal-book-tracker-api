import {BookshelfBookRepository} from '@domain/repositories/bookshelfBook.repository';
import {BookRepository} from '@domain/repositories/book.repository';
import {BookshelfRepository} from '@domain/repositories/bookshelf.repository';
import {AddToBookshelfDto} from '@domain/dtos';
import {BookshelfBookEntity} from '@domain/entities';
import {AddToBookshelfUseCase} from '@domain/use-cases/interfaces/bookshelfBook.interfaces';

export class AddToBookshelf implements AddToBookshelfUseCase {
    constructor(
        public readonly repository: BookshelfBookRepository,
        public readonly bookRepository: BookRepository,
        public readonly bookshelfRepository: BookshelfRepository
    ) {}

    async execute(addToBookshelfDto: AddToBookshelfDto): Promise<BookshelfBookEntity> {
        const {id, pageCount} = await this.bookRepository.findOrCreateByApiId(
            addToBookshelfDto.apiBookId
        );
        const {type} = await this.bookshelfRepository.getBookshelfById(
            addToBookshelfDto.bookshelfId
        );

        addToBookshelfDto.bookId = id;
        addToBookshelfDto.totalPages = pageCount;
        addToBookshelfDto.bookshelfType = type;

        return this.repository.addToBookshelf(addToBookshelfDto);
    }
}
