import {PrintTypeEnum} from '@domain/interfaces/book.interfaces';

export const PRINT_TYPES: ReadonlySet<string> = new Set([
    PrintTypeEnum.All,
    PrintTypeEnum.Books,
    PrintTypeEnum.Magazines,
]);

export const isPrintType = (value: unknown): value is PrintTypeEnum => {
    return typeof value === 'string' && PRINT_TYPES.has(value);
};
