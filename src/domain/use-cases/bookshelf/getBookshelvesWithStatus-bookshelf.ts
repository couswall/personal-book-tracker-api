import {BookshelfRepository} from '@domain/repositories/bookshelf.repository';
import {UserRepository} from '@domain/repositories/user.repository';
import {GetBookshelvesWithStatusDto} from '@domain/dtos/bookshelf/getBookshelvesWithStatus-bookshelf.dto';
import {IBookshelfWithStatus} from '@domain/interfaces/bookshelf.interfaces';
import {GetBookshelvesWithStatusUseCase} from '@domain/use-cases/interfaces/bookshelf.interfaces';

export class GetBookshelvesWithStatus implements GetBookshelvesWithStatusUseCase {
    constructor(
        private readonly repository: BookshelfRepository,
        private readonly userRepository: UserRepository,
    ) {}

    async execute(dto: GetBookshelvesWithStatusDto): Promise<IBookshelfWithStatus[]> {
        await this.userRepository.getById({id: dto.userId});
        return this.repository.getBookshelvesWithStatus(dto.userId, dto.apiBookId);
    }
}
