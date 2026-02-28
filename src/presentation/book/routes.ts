import { Router } from "express";
import { AxiosAdapter } from "@config/index";
import { BookController } from "@presentation/book/controller";
import { BookDatasourceImpl } from "@infrastructure/datasources/book.datasource.impl";
import { BookRepositoryImpl } from "@infrastructure/repositories/book.repository.impl";
import { validateJWT } from "@presentation/middlewares/validate-jwt";

export class BookRoutes{

    static get routes(): Router{
        const router = Router();
        const axiosAdapter = new AxiosAdapter();
        const datasource = new BookDatasourceImpl(axiosAdapter);
        const repository = new BookRepositoryImpl(datasource);
        const bookController = new BookController(repository);

        router.get('/search', validateJWT ,bookController.searchBook);
        router.get('/bookById/:bookId', validateJWT ,bookController.getBookById);

        return router;
    };
}