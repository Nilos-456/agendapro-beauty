const express = require('express');
const router = express.Router();
const appointmentController = require('../controllers/appointmentController');

router.post('/appointments/bulk', appointmentController.storeBulk);
// Rota para listar todos os agendamentos
router.get('/appointments', appointmentController.list);

// Rota para criar um novo agendamento
router.post('/appointments', appointmentController.create);

module.exports = router;
