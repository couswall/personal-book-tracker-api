import {GetBookshelvesWithStatusDto} from '@domain/dtos';

describe('GetBookshelvesWithStatusDto tests', () => {
    test('should create a dto instance from valid input', () => {
        const [error, dto] = GetBookshelvesWithStatusDto.create({apiBookId: 'abc123'});

        expect(error).toBeUndefined();
        expect(dto).toBeInstanceOf(GetBookshelvesWithStatusDto);
        expect((dto as GetBookshelvesWithStatusDto).apiBookId).toBe('abc123');
    });

    test('should not expose a userId, which must come from the token', () => {
        const [, dto] = GetBookshelvesWithStatusDto.create({apiBookId: 'abc123'});

        expect(dto).not.toHaveProperty('userId');
    });

    describe('apiBookId validation', () => {
        test('should return an error when apiBookId is missing', () => {
            const [error, dto] = GetBookshelvesWithStatusDto.create({});

            expect(error).toBe('apiBookId is required');
            expect(dto).toBeUndefined();
        });

        test('should return an error when apiBookId exceeds 15 characters', () => {
            const [error, dto] = GetBookshelvesWithStatusDto.create({
                apiBookId: 'a'.repeat(16),
            });

            expect(error).toBeDefined();
            expect(dto).toBeUndefined();
        });

        test('should return an error when apiBookId contains only blank spaces', () => {
            const [error, dto] = GetBookshelvesWithStatusDto.create({apiBookId: '   '});

            expect(error).toBeDefined();
            expect(dto).toBeUndefined();
        });

        test('should trim apiBookId', () => {
            const [error, dto] = GetBookshelvesWithStatusDto.create({
                apiBookId: '  abc123  ',
            });

            expect(error).toBeUndefined();
            expect((dto as GetBookshelvesWithStatusDto).apiBookId).toBe('abc123');
        });
    });
});
