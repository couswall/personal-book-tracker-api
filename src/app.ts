import {envs} from '@config/envs';
import {Server} from '@presentation/server';
import {AppRoutes} from '@presentation/routes';

void main();

async function main() {
    const server = new Server({
        port: envs.PORT,
        publicPath: envs.PUBLIC_PATH,
        routes: AppRoutes.routes,
    });

    await server.start();
}
