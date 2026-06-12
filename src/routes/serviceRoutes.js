const express = require('express');
const router = express.Router();
const ServiceController = require('../controllers/serviceController'); // Verifique se o caminho e o nome estão certos

router.post('/', ServiceController.store); 
router.get('/', ServiceController.index);


module.exports = router;