const lblTicketOne = document.querySelector('#lbl-ticket-01');
const lblDeskOne = document.querySelector('#lbl-desk-01');
const lblTicketTow = document.querySelector('#lbl-ticket-02');
const lblDeskTwo = document.querySelector('#lbl-desk-02');
const lblTicketThree = document.querySelector('#lbl-ticket-03');
const lblDeskThree = document.querySelector('#lbl-desk-03');
const lblTicketFour = document.querySelector('#lbl-ticket-04');
const lblDeskFour = document.querySelector('#lbl-desk-04');
const lblTickets = [lblTicketOne, lblTicketTow, lblTicketThree, lblTicketFour];
const lblDesks = [lblDeskOne, lblDeskTwo, lblDeskThree, lblDeskFour];

async function init() {
    const tickets = await fetch('http://localhost:3000/api/ticket/working-on', {
        method: 'POST',
    }).then(res => res.json());

    renderTicket(tickets);
}

function renderTicket(tickets) {
    tickets?.forEach((ticket, index) => {
        if (index > 3) return;
        if (ticket) {
            lblTickets[index].innerText = `Ticket ${ticket.number}`;
            lblDesks[index].innerText = ticket.handleAtDesk;
        } else {
            lblTickets[index].style.display = 'none';
            lblDesks[index].style.display = 'none';
        }
    });
}

function connectToWebSockets() {
    const socket = new WebSocket('ws://localhost:3000/ws');

    socket.onmessage = event => {
        const { type, payload } = JSON.parse(event.data);
        if (type !== 'on-working-change') return;

        renderTicket(payload);
    };

    socket.onclose = event => {
        console.log('Connection closed');
        setTimeout(() => {
            console.log('retrying to connect');
            connectToWebSockets();
        }, 1500);
    };

    socket.onopen = event => {
        console.log('Connected');
    };
}

connectToWebSockets();

init();
