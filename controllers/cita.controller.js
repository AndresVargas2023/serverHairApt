const Cita = require('../models/cita.model');

// Obtener todas las citas
exports.getAllCitas = async (req, res) => {
    try {
        const citas = await Cita.find();
        res.status(200).json(citas);
    } catch (error) {
        console.error('Error al obtener las citas:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

// Obtener una cita por su ID
exports.getCitaById = async (req, res) => {
    try {
        const { id } = req.params;
        const cita = await Cita.findById(id);
        if (!cita) {
            return res.status(404).json({ error: 'Cita no encontrada' });
        }
        res.status(200).json(cita);
    } catch (error) {
        console.error('Error al obtener la cita:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};


// Crear una nueva cita
exports.createCita = async (req, res) => {
    try {
        // Obtener los datos de la cita del cuerpo de la solicitud
        const { producto, duracion, precio, horario, nombreCliente, telefonoCliente } = req.body;

        // Crear una nueva instancia de Cita con los datos proporcionados
        const nuevaCita = new Cita({
            producto,
            duracion,
            precio,
            horario,
            nombreCliente,
            telefonoCliente
        });

        // Guardar la nueva cita en la base de datos
        await nuevaCita.save();

        // Enviar una respuesta de éxito
        res.status(201).json({ mensaje: 'Cita creada exitosamente', cita: nuevaCita });
    } catch (error) {
        // Manejar cualquier error y enviar una respuesta de error al cliente
        console.error('Error al crear la cita:', error);
        res.status(500).json({ mensaje: 'Error al crear la cita' });
    }
};
// Actualizar una cita existente
exports.updateCita = async (req, res) => {
    try {
        const { id } = req.params;
        const { servicioId, horario, nombre, telefono } = req.body;
        const citaActualizada = await Cita.findByIdAndUpdate(
            id,
            { servicioId, horario, nombre, telefono },
            { new: true }
        );
        if (!citaActualizada) {
            return res.status(404).json({ error: 'Cita no encontrada' });
        }
        res.status(200).json(citaActualizada);
    } catch (error) {
        console.error('Error al actualizar la cita:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

// Eliminar una cita existente
exports.deleteCita = async (req, res) => {
    try {
        const { id } = req.params;
        const citaEliminada = await Cita.findByIdAndDelete(id);
        if (!citaEliminada) {
            return res.status(404).json({ error: 'Cita no encontrada' });
        }
        res.status(200).json({ message: 'Cita eliminada exitosamente' });
    } catch (error) {
        console.error('Error al eliminar la cita:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};
