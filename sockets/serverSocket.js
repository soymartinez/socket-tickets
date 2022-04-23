const TicketControl = require('../models/ticket-control');
const ticketControl = new TicketControl();

const serverSocket = (socket) => {

    // cliente conectado
    // console.log('🟢 Cliente conectado: ', socket.handshake.headers['sec-ch-ua']);
    console.log('🟢 Cliente conectado: ', socket.id);

    // desconexion de clientes
    socket.on('disconnect', () => {
        console.log('🔴 Cliente desconectado', socket.id);
    });

    socket.emit('ultimo-ticket', ticketControl.ultimo);
    socket.emit('estado-actual', ticketControl.ultimos4);
    socket.emit('tickets-pendientes', ticketControl.tickets.length,
        ticketControl.asesoria.length,
        ticketControl.reclamaciones.length,
        ticketControl.devolucion.length,
        ticketControl.otros.length);


    socket.on('siguiente-ticket', (payload, callback) => {
        const siguiente = ticketControl.siguiente(payload.categoria, payload.color);
        callback(siguiente);

        socket.emit('tickets-pendientes', ticketControl.tickets.length, ticketControl.asesoria.length, ticketControl.reclamaciones.length, ticketControl.devolucion.length, ticketControl.otros.length);
        socket.broadcast.emit('tickets-pendientes', ticketControl.tickets.length, ticketControl.asesoria.length, ticketControl.reclamaciones.length, ticketControl.devolucion.length, ticketControl.otros.length);
    });

    socket.on('atender-ticket', ({ escritorio }, callback) => {
        if (!escritorio) {
            return callback({
                ok: false,
                msg: 'El escritorio es necesario'
            });
        }

        const ticket = ticketControl.atenderTicket(escritorio);

        socket.broadcast.emit('estado-actual', ticketControl.ultimos4);


        socket.emit('tickets-pendientes', ticketControl.tickets.length, ticketControl.asesoria.length, ticketControl.reclamaciones.length, ticketControl.devolucion.length, ticketControl.otros.length);
        socket.broadcast.emit('tickets-pendientes', ticketControl.tickets.length, ticketControl.asesoria.length, ticketControl.reclamaciones.length, ticketControl.devolucion.length, ticketControl.otros.length);

        if (!ticket) {
            callback({
                ok: false,
                msg: 'No hay tickets'
            });
        } else {
            callback({
                ok: true,
                ticket
            });
        }
    });
};

module.exports = {
    serverSocket
}