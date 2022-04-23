
// Referencias del HTML
const lblNuevoTicket  = document.querySelector('#lblNuevoTicket');
const btnCrear  = document.querySelector('button');
const select = document.querySelector('select');

const socket = io();

socket.on('connect', () => {
    btnCrear.disabled = false;
});

socket.on('disconnect', () => {
    btnCrear.disabled = true;
});

socket.on('ultimo-ticket', (ultimo) => {
    lblNuevoTicket.innerText = `Ticket ` + ultimo;
});

btnCrear.addEventListener('click', () => {
    var value = select.value;
    const [ categoria, color ] = value.split('#');

    socket.emit('siguiente-ticket', {categoria, color}, (ticket) => {
        console.log('👌 desde el servidor: ', ticket);

        lblNuevoTicket.innerText = ticket;
    });
});
