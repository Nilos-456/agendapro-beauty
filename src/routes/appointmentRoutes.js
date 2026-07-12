const express = require('express');
const router = express.Router();
const appointmentController = require('../controllers/appointmentController');

/**
 * @swagger
 * /appointments:
 *   get:
 *     summary: Listar todos os agendamentos
 *     tags: [Agendamentos]
 *     parameters:
 *       - in: query
 *         name: professional_id
 *         schema:
 *           type: integer
 *         description: "Filtrar por ID do profissional (opcional)"
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *         description: "Filtrar por status (opcional)"
 *     responses:
 *       200:
 *         description: Lista de agendamentos
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
 *                     $ref: '#/components/schemas/Appointment'
 */
router.get('/', appointmentController.index);

/**
 * @swagger
 * /appointments/professional/{professionalId}:
 *   get:
 *     summary: Listar agendamentos de um profissional
 *     tags: [Agendamentos]
 *     parameters:
 *       - in: path
 *         name: professionalId
 *         schema:
 *           type: integer
 *         required: true
 *     responses:
 *       200:
 *         description: Agendamentos do profissional
 *       404:
 *         description: Profissional não encontrado
 */
router.get('/professional/:professionalId', appointmentController.listByProfessional);

/**
 * @swagger
 * /appointments/{id}:
 *   get:
 *     summary: Buscar agendamento por ID
 *     tags: [Agendamentos]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *     responses:
 *       200:
 *         description: Agendamento encontrado
 *       404:
 *         description: Agendamento não encontrado
 */
router.get('/:id', appointmentController.show);

/**
 * @swagger
 * /appointments:
 *   post:
 *     summary: Criar novo agendamento
 *     tags: [Agendamentos]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - professional_id
 *               - service_id
 *               - data_hora
 *             properties:
 *               professional_id:
 *                 type: integer
 *                 example: 1
 *               service_id:
 *                 type: integer
 *                 example: 1
 *               data_hora:
 *                 type: string
 *                 format: date-time
 *                 example: "2026-07-07T09:00:00"
 *               status:
 *                 type: string
 *                 enum: [agendado, confirmado, concluído, cancelado]
 *                 example: agendado
 *     responses:
 *       201:
 *         description: Agendamento criado com sucesso
 *       400:
 *         description: "Campos obrigatórios faltando ou erro de validação"
 *       404:
 *         description: "Profissional ou Serviço não encontrado"
 */
router.post('/', appointmentController.store);

/**
 * @swagger
 * /appointments/{id}:
 *   put:
 *     summary: Atualizar agendamento
 *     tags: [Agendamentos]
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
 *               professional_id:
 *                 type: integer
 *               service_id:
 *                 type: integer
 *               data_hora:
 *                 type: string
 *                 format: date-time
 *               status:
 *                 type: string
 *     responses:
 *       200:
 *         description: Agendamento atualizado
 *       404:
 *         description: Agendamento não encontrado
 */
router.put('/:id', appointmentController.update);

/**
 * @swagger
 * /appointments/{id}:
 *   delete:
 *     summary: Deletar agendamento
 *     tags: [Agendamentos]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *     responses:
 *       200:
 *         description: Agendamento deletado
 *       404:
 *         description: Agendamento não encontrado
 */
router.delete('/:id', appointmentController.delete);

module.exports = router;