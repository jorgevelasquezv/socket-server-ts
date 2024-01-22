import { UuidAdapter } from '../../config/uuid.adapter';
import { ResponseTicket } from '../../domain/interfaces/response-ticket';
import { Ticket } from '../../domain/interfaces/ticket';
import { WssServices } from './wss.service';

export class TicketService {
    constructor(private readonly wssServices = WssServices.instance) {}

    tickets: Ticket[] = [
        {
            id: UuidAdapter.v4(),
            number: 1,
            createdAt: new Date(),
            done: false,
        },
        {
            id: UuidAdapter.v4(),
            number: 2,
            createdAt: new Date(),
            done: false,
        },
        {
            id: UuidAdapter.v4(),
            number: 3,
            createdAt: new Date(),
            done: false,
        },
        {
            id: UuidAdapter.v4(),
            number: 4,
            createdAt: new Date(),
            done: false,
        },
        {
            id: UuidAdapter.v4(),
            number: 5,
            createdAt: new Date(),
            done: false,
        },
        {
            id: UuidAdapter.v4(),
            number: 6,
            createdAt: new Date(),
            done: false,
        },
    ];

    private readonly workingOnTickets: Ticket[] = [];

    public get pendingTickets(): Ticket[] {
        return this.tickets.filter(
            ticket => !ticket.done && !ticket.handleAtDesk
        );
    }

    public get lastWorkingOnTickets(): Ticket[] {
        return this.workingOnTickets.slice(0, 4);
    }

    public get lastTicketNumber(): number {
        return this.tickets.length > 0
            ? this.tickets[this.tickets.length - 1].number
            : 0;
    }

    public createTicket(): Ticket {
        const ticket: Ticket = {
            id: UuidAdapter.v4(),
            number: this.lastTicketNumber + 1,
            createdAt: new Date(),
            done: false,
            handleAt: undefined,
            handleAtDesk: undefined,
        };
        this.tickets.push(ticket);

        this.onTicketNumberChanged();

        return ticket;
    }

    public drawTicket(desk: string): ResponseTicket {
        const ticket = this.pendingTickets[0];
        if (!ticket) return { status: 'error', message: 'Not pending tickets' };

        ticket.handleAtDesk = desk;
        ticket.handleAt = new Date();

        this.workingOnTickets.unshift({ ...ticket });
        this.onTicketNumberChanged();
        this.onTicketWorkingChanged();

        return { status: 'ok', ticket };
    }

    public onFinishedTicket(ticketId: string): ResponseTicket {
        const ticket = this.tickets.find(ticket => ticket.id === ticketId);
        if (!ticket) return { status: 'error', message: 'Ticket not found' };

        this.tickets.forEach(t => {
            if (t.id === ticketId) {
                t.done = true;
                t.doneAt = new Date();
            }
        });

        return { status: 'ok', ticket };
    }

    public workingOn(desk: string): ResponseTicket {
        const ticket = this.tickets.find(
            ticket => ticket.handleAtDesk === desk
        );
        if (!ticket) return { status: 'error', message: 'Ticket not found' };

        return { status: 'ok', ticket };
    }

    private onTicketNumberChanged() {
        this.wssServices.sendMessage(
            'on-ticket-count-changed',
            this.pendingTickets.length
        );
    }

    private onTicketWorkingChanged() {
        this.wssServices.sendMessage(
            'on-working-change',
            this.workingOnTickets.slice(0, 4)
        );
    }
}
