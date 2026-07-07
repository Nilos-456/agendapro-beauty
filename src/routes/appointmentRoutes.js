const express = require('express');
const router = express.Router();
const appointmentController = require('../controllers/appointmentController');

// Rotas de agendamentos
router.get('/', appointmentController.index);                           // Listar todos
router.post('/', appointmentController.store);                          // Criar novo
router.get('/professional/:professionalId', appointmentController.listByProfessional); // Listar por profissional
router.get('/:id', appointmentController.show);                         // Buscar por ID
router.put('/:id', appointmentController.update);                       // Atualizar
router.delete('/:id', appointmentController.delete);                    // Deletar

module.exports = router;