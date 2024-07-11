const mongoose = require('mongoose');

const CitaSchema = new mongoose.Schema({
    producto: {
        type: String,
        required: true
    },
    duracion: {
        type: String,
        required: true
    },
    precio: {
        type: Number,
        required: true
    },
    horario: {
        type: String,
        required: true
    },
    nombreCliente: {
        type: String,
        required: true
    },
    telefonoCliente: {
        type: String,
        required: true
    },
    fechaCreacion: {
        type: Date,
        default: Date.now
    }
});

const Cita = mongoose.model('Cita', CitaSchema);

module.exports = Cita;
