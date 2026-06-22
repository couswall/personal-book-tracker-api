import {GetBookshelvesWithStatusDto} from '@domain/dtos';

describe('GetBookshelvesWithStatusDto tests', () => {
    const validInput = {userId: 1, apiBookId: 'abc123'};

    test('should create a dto instance from valid input', () => {
        const [error, dto] = GetBookshelvesWithStatusDto.create(validInput);

        expect(error).toBeUndefined();
        expect(dto).toBeInstanceOf(GetBookshelvesWithStatusDto);
        expect((dto as GetBookshelvesWithStatusDto).userId).toBe(1);
        expect((dto as GetBookshelvesWithStatusDto).apiBookId).toBe('abc123');
    });

    describe('userId validation', () => {
        test('should return an error when userId is missing', () => {
            const [error, dto] = GetBookshelvesWithStatusDto.create({
                apiBookId: 'abc123',
            });

            expect(error).toBe('userId is required');
            expect(dto).toBeUndefined();
        });

        test('should return an error when userId is not a number', () => {
            const [error, dto] = GetBookshelvesWithStatusDto.create({
                userId: 'notANumber' as unknown as number,
                apiBookId: 'abc123',
            });

            expect(error).toBe('userId must be a number');
            expect(dto).toBeUndefined();
        });

        test('should coerce userId from a numeric string', () => {
            const [error, dto] = GetBookshelvesWithStatusDto.create({
                userId: '5' as unknown as number,
                apiBookId: 'abc123',
            });

            expect(error).toBeUndefined();
            expect((dto as GetBookshelvesWithStatusDto).userId).toBe(5);
        });
    });

    describe('apiBookId validation', () => {
        test('should return an error when apiBookId is missing', () => {
            const [error, dto] = GetBookshelvesWithStatusDto.create({userId: 1});

            expect(error).toBe('apiBookId is required');
            expect(dto).toBeUndefined();
        });

        test('should return an error when apiBookId exceeds 15 characters', () => {
            const [error, dto] = GetBookshelvesWithStatusDto.create({
                userId: 1,
                apiBookId: 'a'.repeat(16),
            });

            expect(error).toBeDefined();
            expect(dto).toBeUndefined();
        });

        test('should return an error when apiBookId contains only blank spaces', () => {
            const [error, dto] = GetBookshelvesWithStatusDto.create({
                userId: 1,
                apiBookId: '   ',
            });

            expect(error).toBeDefined();
            expect(dto).toBeUndefined();
        });

        test('should trim apiBookId', () => {
            const [error, dto] = GetBookshelvesWithStatusDto.create({
                userId: 1,
                apiBookId: '  abc123  ',
            });

            expect(error).toBeUndefined();
            expect((dto as GetBookshelvesWithStatusDto).apiBookId).toBe('abc123');
        });
    });
});
