const express = require('express');
const router = express.Router();
const ProfessionalController = require('../controllers/ProfessionalController');

// Rotas oficiais no plural
router.get('/professionals', ProfessionalController.index);
router.post('/professionals', ProfessionalController.store);

module.exports = router;
