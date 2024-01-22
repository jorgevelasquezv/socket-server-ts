import { Router } from 'express';
import { TicketController } from './controller';

export class TicketRoutes {
    static get routes() {
        const router = Router();
        const controller = new TicketController();

        router.get('/', (req, res) => {
            controller.getTickets(req, res);
        });
        router.get('/last', (req, res) => {
            controller.getLastTicketNumber(req, res);
        });
        router.get('/pending', (req, res) => {
            controller.pendingTickets(req, res);
        });

        router.post('/', (req, res) => {
            controller.createTicket(req, res);
        });

        router.get('/draw/:desk', (req, res) => {
            controller.drawTicket(req, res);
        });
        router.put('/done/:ticketId', (req, res) => {
            controller.ticketFinished(req, res);
        });

        router.post('/working-on', (req, res) => {
            controller.workingOn(req, res);
        });

        return router;
    }
}
