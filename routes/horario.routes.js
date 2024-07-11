const express = require('express');
const router = express.Router();
const horarioControler = require('../controllers/horario.controller');

// Rutas para el administrador
router.get('/', horarioControler.getHorariosDisponibles); // Obtener todos los horarios (para el administrador)
router.post('/', horarioControler.createHorario); // Crear un nuevo horario (para el administrador)
router.put('/:id', horarioControler.updateHorario); // Actualizar un horario existente (para el administrador)
router.delete('/:id', horarioControler.deleteHorario); // Eliminar un horario existente (para el administrador)

module.exports = router;
