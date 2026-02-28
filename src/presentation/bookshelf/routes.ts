import { Router } from "express";
import { BookshelfController } from "@presentation/bookshelf/controller";
import { BookshelfRepositoryImpl } from "@infrastructure/repositories/bookshelf.repository.impl";
import { BookshelfDatasourceImpl } from "@infrastructure/datasources/bookshelf.datasource.impl";
import { UserRepositoryImpl } from "@infrastructure/repositories/user.repository.impl";
import { UserDatasourceImpl } from "@infrastructure/datasources/user.datasource.impl";
import { validateJWT } from "@presentation/middlewares/validate-jwt";

export class BookshelfRoutes{

    static get routes(): Router{
        const router = Router();
        const bookshelfDatasource = new BookshelfDatasourceImpl();
        const bookshelfRepository = new BookshelfRepositoryImpl(bookshelfDatasource);
        const userRepository = new UserRepositoryImpl(new UserDatasourceImpl());
        const bookshelfController = new BookshelfController(bookshelfRepository, userRepository);

        router.post('/createCustom', validateJWT, bookshelfController.createCustom);
        router.get('/getMyBookshelves/:userId', [validateJWT], bookshelfController.getMyBookshelves);

        return router;
    };
}