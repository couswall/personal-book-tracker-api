import { Router } from "express";
import { AxiosAdapter } from "@config/axios.adapter";
import { BookshelfBookController } from "@presentation/bookshelfBook/controller";
import { BookshelfBookRepositoryImpl } from "@infrastructure/repositories/bookshelfBook.repository.impl";
import { BookshelfBookDatasourceImpl } from '@infrastructure/datasources/bookshelfBook.datasource.impl';
import { BookRepositoryImpl } from "@infrastructure/repositories/book.repository.impl";
import { BookDatasourceImpl } from "@infrastructure/datasources/book.datasource.impl";
import { BookshelfRepositoryImpl } from "@infrastructure/repositories/bookshelf.repository.impl";
import { BookshelfDatasourceImpl } from "@infrastructure/datasources/bookshelf.datasource.impl";
import { validateJWT } from "@presentation/middlewares/validate-jwt";

export class BookshelfBookRoutes{

    static get routes(): Router{
        const router = Router();
        const datasource = new BookshelfBookDatasourceImpl();
        const repository = new BookshelfBookRepositoryImpl(datasource);
        const axiosAdapter = new AxiosAdapter();
        const bookRepository = new BookRepositoryImpl(new BookDatasourceImpl(axiosAdapter));
        const bookshelfRepository = new BookshelfRepositoryImpl(new BookshelfDatasourceImpl());
        const bookshelfController = new BookshelfBookController(repository, bookRepository, bookshelfRepository);

        router.post('/addToBookshelf', [validateJWT], bookshelfController.addToBookshelf);
        router.put('/updateBookshelf', [validateJWT], bookshelfController.updateBookshelf);

        return router;
    }
}