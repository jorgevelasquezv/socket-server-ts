import { Ticket } from "./ticket";

export interface ResponseTicket {
    status: string;
    message?: string;
    ticket?: Ticket;
}