
const lblEscritorio = document.querySelector('h1');
const btnAtender = document.querySelector('button');
const lblTicket = document.querySelector('small');
const divAlerta = document.querySelector('.alert');
const lblPendientes = document.querySelector('#lblPendientes');

const contador1 = document.querySelector('#contador1');
const contador2 = document.querySelector('#contador2');
const contador3 = document.querySelector('#contador3');
const contador4 = document.querySelector('#contador4');

const searchParams = new URLSearchParams(window.location.search);

if (!searchParams.has('escritorio')) {
    window.location = 'index.html';
    throw new Error('El escritorio es necesario');
}

const escritorio = searchParams.get('escritorio');
lblEscritorio.innerText = escritorio;

divAlerta.style.display = 'none';

const socket = io();

socket.on('connect', () => {
    btnAtender.disabled = false;
});

socket.on('disconnect', () => {
    btnAtender.disabled = true;
});

socket.on('tickets-pendientes', (pendientes, asesoria, reclamaciones, devolucion, otros) => {
    if (pendientes < 1) {
        divAlerta.style.display = 'block';
        lblPendientes.style.display = 'none';
    } else {
        divAlerta.style.display = 'none';
        lblPendientes.style.display = 'block';
        lblPendientes.innerText = pendientes;
    }

    contador1.innerText = asesoria;
    contador2.innerText = reclamaciones;
    contador3.innerText = devolucion;
    contador4.innerText = otros;
});

btnAtender.addEventListener('click', () => {
    socket.emit('atender-ticket', { escritorio }, ({ok, ticket, msg}) => {
        if (!ok) {
            lblTicket.innerText = 'Nadie.';
            return divAlerta.style.display = '';
        }

        lblTicket.innerText = 'Ticket ' + ticket.numero;
    });
});