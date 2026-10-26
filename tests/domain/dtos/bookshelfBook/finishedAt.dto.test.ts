import {
    AddToBookshelfDto,
    UpdateBookshelfDto,
    UpdateReadingProgressDto,
} from '@domain/dtos';
import {BOOKSHELF_BOOK_DTO_ERRORS} from '@domain/constants/bookshelfBook.constants';
import {
    addToBookshelfDtoObject,
    updateBookshelfDtoObject,
    updateReadingProgressDtoObject,
} from '@tests/fixtures';

type FinishedAtInput = {finishedAt?: string | null};
type DtoWithFinishedAt = {finishedAt?: Date | null};

// Every DTO that can finish a book parses finishedAt the same way.
const dtoFactories: [
    string,
    (input: FinishedAtInput) => [string?, DtoWithFinishedAt?],
][] = [
    [
        'AddToBookshelfDto',
        (input) => AddToBookshelfDto.create({...addToBookshelfDtoObject, ...input}),
    ],
    [
        'UpdateBookshelfDto',
        (input) => UpdateBookshelfDto.create({...updateBookshelfDtoObject, ...input}),
    ],
    [
        'UpdateReadingProgressDto',
        (input) =>
            UpdateReadingProgressDto.create({
                ...updateReadingProgressDtoObject,
                isFinished: true,
                ...input,
            }),
    ],
];

describe.each(dtoFactories)('%s finishedAt validation', (_name, create) => {
    test('should leave finishedAt undefined when it is not provided', () => {
        const [error, dto] = create({});

        expect(error).toBeUndefined();
        expect(dto?.finishedAt).toBeUndefined();
    });

    test('should keep null to signal an unknown finish date', () => {
        const [error, dto] = create({finishedAt: null});

        expect(error).toBeUndefined();
        expect(dto?.finishedAt).toBeNull();
    });

    test('should parse a YYYY-MM-DD date', () => {
        const [error, dto] = create({finishedAt: '2026-03-15'});

        expect(error).toBeUndefined();
        expect(dto?.finishedAt).toEqual(new Date('2026-03-15T00:00:00Z'));
    });

    test('should return an error for an invalid date', () => {
        const [error, dto] = create({finishedAt: '2026-02-30'});

        expect(error).toBe(BOOKSHELF_BOOK_DTO_ERRORS.FINISHED_AT.INVALID);
        expect(dto).toBeUndefined();
    });

    test('should return an error for a date in the future', () => {
        const [error, dto] = create({finishedAt: '2999-01-01'});

        expect(error).toBe(BOOKSHELF_BOOK_DTO_ERRORS.FINISHED_AT.FUTURE);
        expect(dto).toBeUndefined();
    });
});
