import axios, { AxiosInstance } from "axios";
import { AxiosAdapter } from "@config/axios.adapter";

jest.mock('axios');

describe('axios.adapter tests', () => {
    let mockAxiosInstance: jest.Mocked<AxiosInstance> = {
        get: jest.fn(),
    } as unknown as jest.Mocked<AxiosInstance>;
    const expectedData = {message: 'Hello test'};
    const mockApiUrl = 'https://api.test.com/data';

    beforeEach(() => {
        jest.clearAllMocks();
        (axios.create as jest.Mock).mockReturnValue(mockAxiosInstance);
    });

    test('get() should return data from the response', async () => {

        mockAxiosInstance.get.mockResolvedValueOnce({
            data: expectedData,
            status: 200,
            statusText: 'OK',
            headers: {},
            config: {}
        });

        const adapter = new AxiosAdapter();
        const result = await adapter.get<typeof expectedData>(mockApiUrl);
        
        expect(mockAxiosInstance.get).toHaveBeenCalledWith(mockApiUrl, undefined);
        expect(result).toEqual(expectedData);
    });

    test('get() should forward config', async () => {
        const config = {headers: {Authorization: 'Bearer token'}};

        mockAxiosInstance.get.mockResolvedValueOnce({
            data: expectedData,
            status: 200,
            statusText: 'OK',
            headers: config.headers,
            config,
        });

        const adapter = new AxiosAdapter();
        const result = await adapter.get<typeof expectedData>(mockApiUrl, config);

        expect(mockAxiosInstance.get).toHaveBeenCalledWith(mockApiUrl, config);
        expect(result).toEqual(expectedData);
    });
});