import { BookDatasourceImpl } from "@infrastructure/datasources/book.datasource.impl";
import { HttpClient } from "@config/interfaces";

export const createBookDatasource = () => {
    const mockHttpAdapter: jest.Mocked<HttpClient> = {
        get: jest.fn(),
    }

  const bookDatasourceImpl = new BookDatasourceImpl(mockHttpAdapter);

  return { bookDatasourceImpl, mockHttpAdapter };
};
