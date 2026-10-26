import {Router} from 'express';
import {ReadingChallengeController} from '@presentation/readingChallenge/controller';
import {ReadingChallengeDatasourceImpl} from '@infrastructure/datasources/readingChallenge.datasource.impl';
import {ReadingChallengeRepositoryImpl} from '@infrastructure/repositories/readingChallenge.repository.impl';
import {ReadingSessionDatasourceImpl} from '@infrastructure/datasources/readingSession.datasource.impl';
import {ReadingSessionRepositoryImpl} from '@infrastructure/repositories/readingSession.repository.impl';
import {validateJWT} from '@presentation/middlewares/validate-jwt';

export class ReadingChallengeRoutes {
    static get routes(): Router {
        const router = Router();
        const repository = new ReadingChallengeRepositoryImpl(
            new ReadingChallengeDatasourceImpl()
        );
        const readingSessionRepository = new ReadingSessionRepositoryImpl(
            new ReadingSessionDatasourceImpl()
        );
        const controller = new ReadingChallengeController(
            repository,
            readingSessionRepository
        );

        router.get('/', [validateJWT], controller.getReadingChallengeHistory);
        // Must be registered before '/:year', or "current" is parsed as a year.
        router.get(
            '/current',
            [validateJWT],
            controller.getCurrentReadingChallengeProgress
        );
        router.get('/:year', [validateJWT], controller.getReadingChallengeProgress);
        router.post('/', [validateJWT], controller.createReadingChallenge);
        router.patch('/:year', [validateJWT], controller.updateReadingChallenge);
        router.delete('/:year', [validateJWT], controller.deleteReadingChallenge);

        return router;
    }
}
