import { CreateCustomBookShelfDto } from "@domain/dtos/index";
import { BookshelfEntity } from "@domain/entities";
import { BookshelfRepository } from "@domain/repositories/bookshelf.repository";
import { CreateCustomUseCase } from "@domain/use-cases/interfaces/bookshelf.interfaces";
import { UserRepository } from "@domain/repositories/user.repository";


export class CreateCustom implements CreateCustomUseCase{
    constructor(
        private readonly repository: BookshelfRepository,
        private readonly userRepository: UserRepository,
    ){};

    async execute(createBookShelfDto: CreateCustomBookShelfDto): Promise<BookshelfEntity> {

        await this.userRepository.getById({id: createBookShelfDto.userId});

        const bookshelf = await this.repository.createCustom(createBookShelfDto);

        return bookshelf;
    }
}