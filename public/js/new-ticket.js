const lastTicketLbl = document.getElementById('lbl-new-ticket');
const createTicketBtn = document.getElementById('btn-create-ticket');

async function getLastTicket() {
    await fetch('http://localhost:3000/api/ticket/last').then(response => {
        response
            .json()
            .then(data => {
                lastTicketLbl.innerText = `Ticket ${data}`;
            })
            .catch(err => {
                console.log(err);
            });
    });
}

async function createTicket() {
    await fetch('http://localhost:3000/api/ticket', { method: 'POST' }).then(
        response => {
            response
                .json()
                .then(({number}) => {
                    lastTicketLbl.innerText = `Ticket ${number}`;
                })
                .catch(err => {
                    console.log(err);
                });
        }
    );
}

createTicketBtn.addEventListener('click', createTicket);

getLastTicket();
