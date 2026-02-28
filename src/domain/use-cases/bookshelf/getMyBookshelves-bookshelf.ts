import { BookshelfEntity } from "@domain/entities/index";
import { BookshelfRepository } from "@domain/repositories/bookshelf.repository";
import { UserRepository } from "@domain/repositories/user.repository";
import { GetMyBookShelvesUseCase } from "@domain/use-cases/interfaces/bookshelf.interfaces";

export class GetMyBookShelves implements GetMyBookShelvesUseCase{
    constructor(
        private readonly repository: BookshelfRepository,
        private readonly userRepository: UserRepository,
        
    ){};

    async execute(userId: number): Promise<BookshelfEntity[]> {
        
        await this.userRepository.getById({id: userId});
        const bookshelves = await this.repository.getMyBookshelves(userId);

        return bookshelves;
    }
}