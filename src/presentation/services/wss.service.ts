import { Server } from 'http';
import { WebSocket, WebSocketServer } from 'ws';

interface Options {
    server: Server;
    path?: string; // ws
}

export class WssServices {
    private static _instance: WssServices;
    private wss: WebSocketServer;

    private constructor(options: Options) {
        const { server, path = '/ws' } = options;

        this.wss = new WebSocketServer({ server, path });
        this.start();
    }

    static get instance(): WssServices {
        if (!WssServices._instance) {
            throw new Error('WssServices is not initialized');
        }
        return WssServices._instance;
    }

    static initWss(options: Options) {
        WssServices._instance = new WssServices(options);
    }

    public sendMessage(type: string, payload: Object) {
        this.wss.clients.forEach(client => {
            if (client.readyState === WebSocket.OPEN) {
                client.send(JSON.stringify({ type, payload }));
            }
        });
    }

    public start() {
        this.wss.on('connection', (ws: WebSocket) => {
            console.log('Client connected');

            ws.on('message', message => {
                console.log('Message received: ' + JSON.stringify(message));
            });

            ws.on('close', () => {
                console.log('Client disconnected');
            });
        });
    }
}
