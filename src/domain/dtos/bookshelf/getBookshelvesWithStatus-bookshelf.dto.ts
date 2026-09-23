import {isValidString} from '@domain/dtos/book/helpers';

export class GetBookshelvesWithStatusDto {
    constructor(public readonly apiBookId: string) {}

    static create(object: {apiBookId?: string}): [string?, GetBookshelvesWithStatusDto?] {
        const [apiBookIdError, trimmedApiBookId = ''] = isValidString(
            'apiBookId',
            object.apiBookId,
            0,
            15,
            true
        );
        if (apiBookIdError) return [apiBookIdError];

        return [undefined, new GetBookshelvesWithStatusDto(trimmedApiBookId)];
    }
}
