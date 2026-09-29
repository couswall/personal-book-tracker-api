import {Router} from 'express';
import {DashboardController} from '@presentation/dashboard/controller';
import {BookshelfDatasourceImpl} from '@infrastructure/datasources/bookshelf.datasource.impl';
import {BookshelfRepositoryImpl} from '@infrastructure/repositories/bookshelf.repository.impl';
import {ReadingChallengeDatasourceImpl} from '@infrastructure/datasources/readingChallenge.datasource.impl';
import {ReadingChallengeRepositoryImpl} from '@infrastructure/repositories/readingChallenge.repository.impl';
import {ReadingSessionDatasourceImpl} from '@infrastructure/datasources/readingSession.datasource.impl';
import {ReadingSessionRepositoryImpl} from '@infrastructure/repositories/readingSession.repository.impl';
import {validateJWT} from '@presentation/middlewares/validate-jwt';

export class DashboardRoutes {
    static get routes(): Router {
        const router = Router();
        const controller = new DashboardController(
            new BookshelfRepositoryImpl(new BookshelfDatasourceImpl()),
            new ReadingChallengeRepositoryImpl(new ReadingChallengeDatasourceImpl()),
            new ReadingSessionRepositoryImpl(new ReadingSessionDatasourceImpl())
        );

        router.get('/', [validateJWT], controller.getDashboard);

        return router;
    }
}
