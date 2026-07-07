const express = require('express');
const router = express.Router();
const serviceController = require('../controllers/ServiceController');

// Rotas de serviços
router.get('/', serviceController.index);                          // Listar com filtro opcional
router.post('/bulk', serviceController.bulkCreate);                // Criar em massa
router.post('/', serviceController.store);                         // Criar um único
router.get('/:id', serviceController.show);                        // Buscar por ID
router.put('/:id', serviceController.update);                      // Atualizar
router.delete('/:id', serviceController.delete);                   // Deletar

module.exports = router;