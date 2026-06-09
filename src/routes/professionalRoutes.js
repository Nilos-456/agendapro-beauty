
const express = require('express');
const router = express.Router();
const ProfessionalController = require('../controllers/ProfessionalController');

// Rotas oficiais
router.get('/professionals', ProfessionalController.index);
router.post('/professionals', ProfessionalController.store);
router.put('/professionals/:id', ProfessionalController.update);   // Linha Nova!
router.delete('/professionals/:id', ProfessionalController.delete); // Linha Nova!

module.exports = router;
