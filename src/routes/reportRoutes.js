const express = require('express');
const router = express.Router();
const reportController = require('../controllers/reportController');
const auth = require('../middleware/authMiddleware');
const admin = require('../middleware/adminMiddleware');

/**
 * @swagger
 * /reports/dashboard:
 *   get:
 *     summary: Obter consolidados estatísticos do dashboard
 *     tags: [Relatórios]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Estatísticas consolidadas carregadas com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: object
 *                   properties:
 *                     totals:
 *                       type: object
 *                     topServices:
 *                       type: array
 *                     topProfessionals:
 *                       type: array
 *       401:
 *         description: Não autorizado
 *       403:
 *         description: Acesso negado para não administradores
 */
router.get('/dashboard', auth, admin, reportController.getDashboardStats);

module.exports = router;
