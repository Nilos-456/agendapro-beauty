const express = require('express');
const router = express.Router();
const serviceController = require('../controllers/serviceController');

// Rotas existentes
router.get('/', serviceController.index);
router.post('/', serviceController.store);

// Novas rotas adicionadas para o CRUD completo
router.put('/:id', serviceController.update);
router.delete('/:id', serviceController.delete);

module.exports = router;