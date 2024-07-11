const Horario = require('../models/horario.model');

// Obtener todos los horarios disponibles
exports.getHorariosDisponibles = async (req, res) => {
    try {
        const horarios = await Horario.find();
        res.status(200).json(horarios);
    } catch (error) {
        console.error('Error al obtener los horarios disponibles:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

// Crear un nuevo horario
exports.createHorario = async (req, res) => {
    try {
        const {hora } = req.body;
        const nuevoHorario = new Horario({
            hora,
            disponible: true,
        });
        const horarioGuardado = await nuevoHorario.save();
        res.status(201).json(horarioGuardado);
    } catch (error) {
        console.error('Error al crear un nuevo horario:', error);
        res.status(500).json({ error: 'Internal Server horror' });
    }
};

// Actualizar un horario existente
exports.updateHorario = async (req, res) => {
    try {
        const { id } = req.params;
        
        // Actualizar solo el campo 'disponible' a false para el horario correspondiente al ID
        await Horario.findByIdAndUpdate(id, { disponible: false });

        res.status(200).json({ message: 'Horario actualizado exitosamente' });
    } catch (error) {
        console.error('Error al actualizar el horario:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};


// Eliminar un horario existente
exports.deleteHorario = async (req, res) => {
    try {
        const { id } = req.params;
        await Horario.findByIdAndDelete(id);
        res.status(200).json({ message: 'Horario eliminado exitosamente' });
    } catch (error) {
        console.error('Error al eliminar el horario:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};
