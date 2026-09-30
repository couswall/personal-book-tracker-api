import {BookshelfRepository} from '@domain/repositories/bookshelf.repository';
import {UserRepository} from '@domain/repositories/user.repository';
import {GetBookshelvesWithStatusDto} from '@domain/dtos/bookshelf/getBookshelvesWithStatus-bookshelf.dto';
import {IBookshelvesStatus} from '@domain/interfaces/bookshelf.interfaces';
import {GetBookshelvesWithStatusUseCase} from '@domain/use-cases/interfaces/bookshelf.interfaces';

export class GetBookshelvesWithStatus implements GetBookshelvesWithStatusUseCase {
    constructor(
        private readonly repository: BookshelfRepository,
        private readonly userRepository: UserRepository
    ) {}

    async execute(
        userId: number,
        dto: GetBookshelvesWithStatusDto
    ): Promise<IBookshelvesStatus> {
        await this.userRepository.getById({id: userId});
        return this.repository.getBookshelvesWithStatus(userId, dto.apiBookId);
    }
}
