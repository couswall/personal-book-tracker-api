import { envs } from "@config/envs";
import { Server } from "@presentation/server";
import { AppRoutes } from "@presentation/routes";

describe('server.ts tests', () => {

    const options = {
        port: envs.PORT,
        publicPath: envs.PUBLIC_PATH,
        routes: AppRoutes.routes,
    };

    const server = new Server(options);

    test('should create a server instance', () => {
        expect(server).toBeInstanceOf(Server);
        expect(typeof server.start).toBe("function");
        expect(typeof server.close).toBe("function");
    });

    test('close() should shut down the server properly', () => {
        expect(() => server.close()).not.toThrow();
    });
});