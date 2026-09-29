import {Router} from 'express';
import {AuthRoutes} from '@presentation/auth/routes';
import {BookRoutes} from '@presentation/book/routes';
import {BookshelfRoutes} from '@presentation/bookshelf/routes';
import {BookshelfBookRoutes} from '@presentation/bookshelfBook/routes';
import {ReadingChallengeRoutes} from '@presentation/readingChallenge/routes';
import {DashboardRoutes} from '@presentation/dashboard/routes';

export class AppRoutes {
    static get routes(): Router {
        const router = Router();

        router.use('/api/auth', AuthRoutes.routes);
        router.use('/api/book', BookRoutes.routes);
        router.use('/api/bookshelf', BookshelfRoutes.routes);
        router.use('/api/bookshelfBook', BookshelfBookRoutes.routes);
        router.use('/api/readingChallenge', ReadingChallengeRoutes.routes);
        router.use('/api/dashboard', DashboardRoutes.routes);

        return router;
    }
}
