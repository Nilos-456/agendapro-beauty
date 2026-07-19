const express = require('express');
const router = express.Router();
const professionalController = require('../controllers/ProfessionalController');
const auth = require('../middleware/authMiddleware');
const admin = require('../middleware/adminMiddleware');

/**
 * @swagger
 * /professionals:
 *   get:
 *     summary: Listar todos os profissionais ativos
 *     tags: [Profissionais]
 *     responses:
 *       200:
 *         description: Lista de profissionais obtida com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 count:
 *                   type: integer
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Professional'
 */
router.get('/', professionalController.index);

/**
 * @swagger
 * /professionals/specialty:
 *   get:
 *     summary: Buscar profissionais por especialidade
 *     tags: [Profissionais]
 *     parameters:
 *       - in: query
 *         name: especialidade
 *         schema:
 *           type: string
 *         required: true
 *         description: "Especialidade do profissional (ex: Cabeleireiro)"
 *     responses:
 *       200:
 *         description: Profissionais encontrados
 *       400:
 *         description: Especialidade é obrigatória
 */
router.get('/specialty', professionalController.findBySpecialty);

/**
 * @swagger
 * /professionals/{id}:
 *   get:
 *     summary: Buscar profissional por ID
 *     tags: [Profissionais]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID do profissional
 *     responses:
 *       200:
 *         description: Profissional encontrado
 *       404:
 *         description: Profissional não encontrado
 */
router.get('/:id', professionalController.show);

/**
 * @swagger
 * /professionals:
 *   post:
 *     summary: Criar novo profissional
 *     tags: [Profissionais]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - nome
 *               - especialidade
 *               - telefone
 *             properties:
 *               nome:
 *                 type: string
 *                 example: João Silva
 *               especialidade:
 *                 type: string
 *                 example: Cabeleireiro
 *               telefone:
 *                 type: string
 *                 example: "11912345678"
 *     responses:
 *       201:
 *         description: Profissional criado com sucesso
 *       400:
 *         description: Campos obrigatórios faltando
 */
router.post('/', auth, admin, professionalController.store);

/**
 * @swagger
 * /professionals/{id}:
 *   put:
 *     summary: Atualizar profissional
 *     tags: [Profissionais]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nome:
 *                 type: string
 *               especialidade:
 *                 type: string
 *               telefone:
 *                 type: string
 *     responses:
 *       200:
 *         description: Profissional atualizado
 *       404:
 *         description: Profissional não encontrado
 */
router.put('/:id', auth, admin, professionalController.update);

/**
 * @swagger
 * /professionals/{id}:
 *   delete:
 *     summary: Deletar profissional
 *     tags: [Profissionais]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *     responses:
 *       200:
 *         description: Profissional deletado
 *       404:
 *         description: Profissional não encontrado
 */
router.delete('/:id', auth, admin, professionalController.delete);

module.exports = router;
