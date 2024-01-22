import { createServer } from 'http';
import { envs } from './config/envs';
import { AppRoutes } from './presentation/routes';
import { Server } from './presentation/server';
import { WssServices } from './presentation/services/wss.service';

(async () => {
    main();
})();

function main() {
    const server = new Server({
        port: envs.PORT,
    });

    const httpServer = createServer(server.app);

    WssServices.initWss({ server: httpServer, path: '/ws' });

    server.setRoutes(AppRoutes.routes);

    httpServer.listen(envs.PORT, () => {
        console.log(`Server listening on port ${envs.PORT}`);
    });
}
