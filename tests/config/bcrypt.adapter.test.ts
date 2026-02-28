import bcrypt from "bcryptjs";
import { BCryptAdapter } from "@config/bcrypt.adapter";

jest.mock('bcryptjs',() => ({
    genSaltSync: jest.fn(),
    hashSync: jest.fn(),
    compareSync: jest.fn(),
}));

describe('bcrypt adapter tests', () => {
    const mockSalt = 'Mock Salt';
    const mockHashPassword = 'This is a hashed password';
    const mockPassword = 'ThisIsAPassword1234!!!!!!';

    beforeEach(() => {
        jest.clearAllMocks();
    });

    test('hash() should return a hashed string', () => {

        (bcrypt.genSaltSync as jest.Mock).mockReturnValue(mockSalt);
        (bcrypt.hashSync as jest.Mock).mockReturnValue(mockHashPassword);

        const result = BCryptAdapter.hash(mockPassword);

        expect(bcrypt.genSaltSync).toHaveBeenCalled();
        expect(bcrypt.hashSync).toHaveBeenCalled();
        expect(bcrypt.hashSync).toHaveBeenCalledWith(mockPassword, mockSalt);
        expect(result).toBe(mockHashPassword);
    });

    test('compare() should return true for a matching password', () => {
        (bcrypt.compareSync as jest.Mock).mockReturnValue(true);

        const result = BCryptAdapter.compare(mockPassword, mockHashPassword);

        expect(bcrypt.compareSync).toHaveBeenCalled();
        expect(bcrypt.compareSync).toHaveBeenCalledWith(mockPassword, mockHashPassword);
        expect(result).toBeTruthy();
    });

    test('compare() should return true for a non-matching password', () => {
        (bcrypt.compareSync as jest.Mock).mockReturnValue(false);

        const result = BCryptAdapter.compare(mockPassword, mockHashPassword);

        expect(bcrypt.compareSync).toHaveBeenCalled();
        expect(bcrypt.compareSync).toHaveBeenCalledWith(mockPassword, mockHashPassword);
        expect(result).toBeFalsy();
    });
});