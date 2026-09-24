import {Router} from 'express';
import {ReadingChallengeController} from '@presentation/readingChallenge/controller';
import {ReadingChallengeDatasourceImpl} from '@infrastructure/datasources/readingChallenge.datasource.impl';
import {ReadingChallengeRepositoryImpl} from '@infrastructure/repositories/readingChallenge.repository.impl';
import {validateJWT} from '@presentation/middlewares/validate-jwt';

export class ReadingChallengeRoutes {
    static get routes(): Router {
        const router = Router();
        const repository = new ReadingChallengeRepositoryImpl(
            new ReadingChallengeDatasourceImpl()
        );
        const controller = new ReadingChallengeController(repository);

        router.post('/', [validateJWT], controller.createReadingChallenge);
        router.patch('/:year', [validateJWT], controller.updateReadingChallenge);
        router.delete('/:year', [validateJWT], controller.deleteReadingChallenge);

        return router;
    }
}
