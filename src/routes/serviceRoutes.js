const express = require('express');
const router = express.Router();
const serviceController = require('../controllers/ServiceController');
const auth = require('../middleware/authMiddleware');
const admin = require('../middleware/adminMiddleware');

/**
 * @swagger
 * /services:
 *   get:
 *     summary: Listar todos os serviços
 *     tags: [Serviços]
 *     parameters:
 *       - in: query
 *         name: area_id
 *         schema:
 *           type: integer
 *         description: "Filtrar por ID da área (opcional)"
 *     responses:
 *       200:
 *         description: Lista de serviços
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
 *                     $ref: '#/components/schemas/Service'
 */
router.get('/', serviceController.index);

/**
 * @swagger
 * /services/{id}:
 *   get:
 *     summary: Buscar serviço por ID
 *     tags: [Serviços]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *     responses:
 *       200:
 *         description: Serviço encontrado
 *       404:
 *         description: Serviço não encontrado
 */
router.get('/:id', serviceController.show);

/**
 * @swagger
 * /services/bulk:
 *   post:
 *     summary: Criar múltiplos serviços
 *     tags: [Serviços]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: array
 *             items:
 *               type: object
 *               required:
 *                 - nome_servico
 *                 - preco
 *                 - duracao
 *               properties:
 *                 area_id:
 *                   type: integer
 *                 nome_servico:
 *                   type: string
 *                 preco:
 *                   type: number
 *                 duracao:
 *                   type: integer
 *     responses:
 *       201:
 *         description: Serviços criados em massa
 *       400:
 *         description: Formato inválido
 */
router.post('/bulk', auth, admin, serviceController.bulkCreate);

/**
 * @swagger
 * /services:
 *   post:
 *     summary: Criar novo serviço
 *     tags: [Serviços]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - nome_servico
 *               - preco
 *               - duracao
 *             properties:
 *               area_id:
 *                 type: integer
 *                 example: 1
 *               nome_servico:
 *                 type: string
 *                 example: "Corte de Cabelo Premium"
 *               preco:
 *                 type: number
 *                 example: 60
 *               duracao:
 *                 type: integer
 *                 example: 45
 *     responses:
 *       201:
 *         description: Serviço criado
 *       400:
 *         description: Campos obrigatórios faltando
 */
router.post('/', auth, admin, serviceController.store);

/**
 * @swagger
 * /services/{id}:
 *   put:
 *     summary: Atualizar serviço
 *     tags: [Serviços]
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
 *               area_id:
 *                 type: integer
 *               nome_servico:
 *                 type: string
 *               preco:
 *                 type: number
 *               duracao:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Serviço atualizado
 *       404:
 *         description: Serviço não encontrado
 */
router.put('/:id', auth, admin, serviceController.update);

/**
 * @swagger
 * /services/{id}:
 *   delete:
 *     summary: Deletar serviço
 *     tags: [Serviços]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *     responses:
 *       200:
 *         description: Serviço deletado
 *       404:
 *         description: Serviço não encontrado
 */
router.delete('/:id', auth, admin, serviceController.delete);

module.exports = router;