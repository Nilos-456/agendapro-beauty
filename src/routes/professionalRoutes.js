const express = require('express');
const router = express.Router();
const professionalController = require('../controllers/ProfessionalController');

// Rotas de profissionais
router.get('/', professionalController.index);                          // Listar todos
router.get('/specialty', professionalController.findBySpecialty);      // Buscar por especialidade
router.get('/:id', professionalController.show);                        // Buscar por ID
router.post('/', professionalController.store);                         // Criar novo
router.put('/:id', professionalController.update);                      // Atualizar
router.delete('/:id', professionalController.delete);                   // Deletar

module.exports = router;
