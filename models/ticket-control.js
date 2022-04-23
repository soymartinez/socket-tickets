const path = require('path');
const fs = require('fs');

class Ticket {
    constructor(numero, escritorio, categoria, color) {
        this.numero = numero;
        this.escritorio = escritorio;
        this.categoria = categoria;
        this.color = '#' + color;
    }
}

class TicketControl {

    constructor() {
        this.ultimo = 0;
        this.hoy = new Date().getDate();
        this.tickets = [];
        this.ultimos4 = [];
        this.asesoria = [];
        this.reclamaciones = [];
        this.devolucion = [];
        this.otros = [];

        this.init();
    }

    get toJson() {
        return {
            ultimo: this.ultimo,
            hoy: this.hoy,
            tickets: this.tickets,
            ultimos4: this.ultimos4,
            asesoria: this.asesoria,
            reclamaciones: this.reclamaciones,
            devolucion: this.devolucion,
            otros: this.otros
        }
    }

    init() {
        const { hoy, tickets, ultimo, ultimos4, asesoria, reclamaciones, devolucion, otros } = require('../db/data.json');
        if (hoy === this.hoy) {
            this.tickets = tickets;
            this.ultimo = ultimo;
            this.ultimos4 = ultimos4;
            this.asesoria = asesoria;
            this.reclamaciones = reclamaciones;
            this.devolucion = devolucion;
            this.otros = otros
        } else {
            this.guardarDB();
        }
    }

    guardarDB() {
        const dbPath = path.join(__dirname, '../db/data.json');
        fs.writeFileSync(dbPath, JSON.stringify(this.toJson));
    }

    siguiente(categoria, color) {
        this.ultimo += 1;
        const ticket = new Ticket(this.ultimo, null, categoria, color);
        this.tickets.push(ticket);

        switch (categoria) {
            case categoria = 'Asesoría':
                this.asesoria.push(ticket);
                break;
            case categoria = 'Reclamaciones':
                this.reclamaciones.push(ticket);
                break;
            case categoria = 'Devolución de productos o servicios':
                this.devolucion.push(ticket);
                break;
            case categoria = 'Otros':
                this.otros.push(ticket);
                break;
            default:
                break;
        }

        this.guardarDB();
        return 'Ticket ' + ticket.numero;
    }

    atenderTicket(escritorio) {
        if (this.tickets.length === 0) {
            return null;
        }

        const ticket = this.tickets.shift();
        ticket.escritorio = escritorio;

        this.ultimos4.unshift(ticket);

        if (ticket.categoria === 'Asesoría') {
            this.asesoria.shift();
        } else if (ticket.categoria === 'Reclamaciones') {
            this.reclamaciones.shift();
        } else if (ticket.categoria === 'Devolución de productos o servicios') {
            this.devolucion.shift();
        } else if (ticket.categoria === 'Otros') {
            this.otros.shift();
        }

        if (this.ultimos4.length > 4) {
            this.ultimos4.splice(-1, 1);
        }

        this.guardarDB();

        return ticket;
    }
}

module.exports = TicketControl;