import { HttpClient } from "@config/interfaces";

export const getMockHttpAdapter = () => {
    const mockHttpAdapter: jest.Mocked<HttpClient> = {
        get: jest.fn(),
    };

    return mockHttpAdapter;
}