import {envs} from '@config/envs';
import {Server} from '@presentation/server';
import {AppRoutes} from '@presentation/routes';
import {logger} from '@config/logger';

process.on('unhandledRejection', (reason: unknown) => {
    logger.fatal('Unhandled promise rejection', {err: reason});
    process.exit(1);
});

process.on('uncaughtException', (error: Error) => {
    logger.fatal('Uncaught exception', {err: error});
    process.exit(1);
});

void main();

async function main() {
    const server = new Server({
        port: envs.PORT,
        publicPath: envs.PUBLIC_PATH,
        routes: AppRoutes.routes,
    });

    await server.start();
}
