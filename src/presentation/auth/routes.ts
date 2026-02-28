import { Router } from "express";
import { AuthController } from "@presentation/auth/controller";
import { UserDatasourceImpl } from "@infrastructure/datasources/user.datasource.impl";
import { UserRepositoryImpl } from "@infrastructure/repositories/user.repository.impl";
import { validateJWT } from "@presentation/middlewares/validate-jwt";

export class AuthRoutes{
    
    static get routes(): Router{
        const router = Router();
        const datasource = new UserDatasourceImpl();
        const repository = new UserRepositoryImpl(datasource);
        const authController = new AuthController(repository);

        router.post('/login', authController.loginUser);
        router.post('/register', authController.registerUser);
        router.post('/refresh', validateJWT, authController.refreshToken);

        return router;
    }
}