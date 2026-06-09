const express = require('express');
const router = express.Router();
const ServiceController = require('../controllers/ServiceController');

// Rotas para a entidade de Serviços
router.get('/services', ServiceController.index);
router.post('/services', ServiceController.store);

module.exports = router;