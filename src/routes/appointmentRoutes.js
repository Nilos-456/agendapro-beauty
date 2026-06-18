const express = require('express');
const router = express.Router();
const appointmentController = require('../controllers/appointmentController');

// Garanta que os métodos mapeados abaixo existam no controlador
router.get('/', appointmentController.index);
router.post('/', appointmentController.store);
router.put('/:id', appointmentController.update);
router.delete('/:id', appointmentController.delete);

module.exports = router;