const pendingLbl = document.querySelector('#lbl-pending');
const deskLbl = document.querySelector('#lbl-desk-title');
const showTicketsPendingAlert = document.querySelector(
    '#div-not-tickets-pending'
);
const attendTicketBtn = document.querySelector('#btn-attend-ticket');
const attendingTicketLbl = document.querySelector('#lbl-attending-ticket');

let workingTicket = null;

async function attendTicket() {
    const desk = deskLbl.innerText;

    const { ticket, message, status } = await fetch(
        `http://localhost:3000/api/ticket/draw/${desk}`
    ).then(res => res.json());

    finishedTicket();

    if (status === 'ok') {
        attendingTicketLbl.innerText = `Ticket ${ticket.number}`;
        workingTicket = ticket;
    } else {
        attendingTicketLbl.innerText = message;
    }
}

async function checkTicketCount(currentCount = 0) {
    pendingLbl.innerHTML = currentCount;

    if (currentCount === 0) {
        showTicketsPendingAlert.style.display = 'block';
        return;
    }
    showTicketsPendingAlert.style.display = 'none';
}

async function finishedTicket() {
    if (!workingTicket) return;
    await fetch(`http://localhost:3000/api/ticket/done/${workingTicket.id}`, {
        method: 'PUT',
    }).then(res => res.json());
    workingTicket = null;
}

function getDesk() {
    const urlParams = new URLSearchParams(window.location.search);
    if (!urlParams.has('escritorio')) {
        window.location = 'index.html';
        throw new Error('Desk is required');
    }
    const desk = urlParams.get('escritorio');
    deskLbl.innerText = desk;
}

async function loadInitialCount() {
    const pending = await fetch(
        'http://localhost:3000/api/ticket/pending'
    ).then(res => res.json());
    checkTicketCount(pending.length);
}

function connectToWebSockets() {
    const socket = new WebSocket('ws://localhost:3000/ws');

    socket.onmessage = event => {
        const { type, payload } = JSON.parse(event.data);
        if (type === 'on-ticket-count-changed') checkTicketCount(payload);
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

attendTicketBtn.addEventListener('click', attendTicket);

connectToWebSockets();
loadInitialCount();
getDesk();
checkTicketCount();
