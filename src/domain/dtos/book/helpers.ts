export const isValidStringArray = (
    fieldName: string,
    array?: string[]
): string | undefined => {
    if (!array) return `${fieldName} is required`;
    if (!Array.isArray(array)) return `${fieldName} must be an array`;
    const areAllStrings = array.every((a) => typeof a === 'string');
    if (!areAllStrings) return `${fieldName} must be an array of strings`;

    return undefined;
};

const validateStringLength = (
    fieldName: string,
    text: string,
    minLength?: number,
    maxLength?: number
): string | undefined => {
    if (minLength && text.length < minLength) {
        const label = minLength === 1 ? 'character' : 'characters';
        return `${fieldName} must contain at least ${minLength} ${label} long`;
    }
    if (maxLength && text.length > maxLength)
        return `${fieldName} must contain at most ${maxLength} characters long`;
    return undefined;
};

export const isValidString = (
    fieldName: string,
    text?: string,
    minLength?: number,
    maxLength?: number,
    blankSpaces: boolean = true
): [string?, string?] => {
    if (!text) return [`${fieldName} is required`];
    if (typeof text !== 'string') return [`${fieldName} must be a string`];
    const trimmedText = text.trim();
    if (blankSpaces && trimmedText.length === 0)
        return [`${fieldName} must not contain only blank spaces`];
    const lengthError = validateStringLength(
        fieldName,
        trimmedText,
        minLength,
        maxLength
    );
    if (lengthError) return [lengthError];
    return [undefined, trimmedText];
};

export const isValidNullString = (
    fieldName: string,
    text: string | null,
    minLength?: number,
    maxLength?: number,
    blankSpaces: boolean = true
): string | undefined => {
    if (text === null) return undefined;
    if (typeof text !== 'string') return `${fieldName} must be a string or null`;
    const trimmedText = text.trim();
    if (blankSpaces && trimmedText.length === 0)
        return `${fieldName} must not contain only blank spaces`;
    return validateStringLength(fieldName, trimmedText, minLength, maxLength);
};

export const isValidRequiredNumber = (
    fieldName: string,
    field?: number | string,
    isOptional: boolean = false
): [string?, number?] => {
    if (field === undefined || field === null) {
        if (isOptional) return [undefined, undefined];
        return [`${fieldName} is required`];
    }
    if (Array.isArray(field) || typeof field === 'boolean')
        return [`${fieldName} must be a number`];
    field = +field;
    if (isNaN(field)) return [`${fieldName} must be a number`];

    return [undefined, field];
};
