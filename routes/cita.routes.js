const express = require('express');
const router = express.Router();
const citaController = require('../controllers/cita.controller');


// Rutas para las citas
router.get('/', citaController.getAllCitas); // Obtener todas las citas
router.get('/:id', citaController.getCitaById); // Obtener una cita por su ID
router.post('/',  citaController.createCita); // Crear una nueva cita
router.put('/:id', citaController.updateCita); // Actualizar una cita existente
router.delete('/:id', citaController.deleteCita); // Eliminar una cita existente

module.exports = router;
