const mongoose = require('mongoose');

const HorarioSchema = new mongoose.Schema({
    hora: {
        type: String,
        required: true
    },
    disponible: {
        type: Boolean,
        default: true
    }
});

const Horario = mongoose.model('Horario', HorarioSchema);

module.exports = Horario;
