const express = require('express');
const router = express.Router();
// Importação correta com o "p" minúsculo conforme a sua pasta
const professionalController = require('../controllers/professionalController');

// Rotas limpas (o /professionals já é injetado pelo server.js)
router.get('/', professionalController.index);
router.post('/', professionalController.store);
router.put('/:id', professionalController.update);
router.delete('/:id', professionalController.delete);

module.exports = router;
