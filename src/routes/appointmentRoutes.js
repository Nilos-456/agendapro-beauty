const express = require('express');
const router = express.Router();
const AppointmentController = require('../controllers/appointmentController');

// Linha 5: Garanta que aponta exatamente para AppointmentController.createBulk
router.post('/bulk', AppointmentController.createBulk);

module.exports = router;