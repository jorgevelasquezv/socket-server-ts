import { Request, Response } from 'express';
import { TicketService } from '../services/ticket.service';

export class TicketController {
    constructor(private readonly services = new TicketService) {}

    public getTickets = async (req: Request, res: Response) => {
        res.json(this.services.tickets);
    };

    public getLastTicketNumber = async (req: Request, res: Response) => {
        res.json(this.services.lastTicketNumber);
    };

    public pendingTickets = async (req: Request, res: Response) => {
        res.json(this.services.pendingTickets);
    };

    public createTicket = async (req: Request, res: Response) => {
        res.status(201).json(this.services.createTicket());
    };

    public drawTicket = async (req: Request, res: Response) => {
        const { desk } = req.params;
        res.json(this.services.drawTicket(desk));
    };

    public ticketFinished = async (req: Request, res: Response) => {
        const { ticketId } = req.params;
        res.json(this.services.onFinishedTicket(ticketId));
    };

    public workingOn = async (req: Request, res: Response) => {
        res.json(this.services.lastWorkingOnTickets);
    };
}
