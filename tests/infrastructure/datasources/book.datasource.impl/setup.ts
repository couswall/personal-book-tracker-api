import {BookDatasourceImpl} from '@/src/infrastructure/datasources/book/book.datasource.impl';
import {HttpClient} from '@config/interfaces';

export const createBookDatasource = () => {
    const mockHttpAdapter: jest.Mocked<HttpClient> = {
        get: jest.fn(),
    };

    const bookDatasourceImpl = new BookDatasourceImpl(mockHttpAdapter);

    return {bookDatasourceImpl, mockHttpAdapter};
};
