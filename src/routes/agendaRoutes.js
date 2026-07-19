const express = require('express');
const router = express.Router();

const HourWorkController = require('../controllers/HourWorkController');
const BlockedHourController = require('../controllers/BlockedHourController');
const agendaController = require('../controllers/agendaController');
const auth = require('../middleware/authMiddleware');
const admin = require('../middleware/adminMiddleware');

/**
 * @swagger
 * /agenda/hours:
 *   post:
 *     summary: Cadastrar ou atualizar horário de trabalho de um profissional
 *     tags: [Agenda]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - professional_id
 *               - dia_semana
 *               - hora_inicio
 *               - hora_fim
 *             properties:
 *               professional_id:
 *                 type: integer
 *                 example: 1
 *               dia_semana:
 *                 type: integer
 *                 description: Dia da semana (0 = Domingo, 6 = Sábado)
 *                 minimum: 0
 *                 maximum: 6
 *                 example: 1
 *               hora_inicio:
 *                 type: string
 *                 description: Horário de início no formato HH:MM (ou HH:MM:SS)
 *                 example: "08:00"
 *               hora_fim:
 *                 type: string
 *                 description: Horário de fim no formato HH:MM (ou HH:MM:SS)
 *                 example: "18:00"
 *     responses:
 *       201:
 *         description: Horário de trabalho registrado com sucesso
 *       400:
 *         description: Parâmetros inválidos
 *       404:
 *         description: Profissional não encontrado
 */
router.post('/agenda/hours', auth, admin, HourWorkController.store);

/**
 * @swagger
 * /agenda/blocks:
 *   post:
 *     summary: Bloquear manualmente um horário para um profissional
 *     tags: [Agenda]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - professional_id
 *               - inicio
 *               - fim
 *             properties:
 *               professional_id:
 *                 type: integer
 *                 example: 1
 *               inicio:
 *                 type: string
 *                 format: date-time
 *                 description: Início do bloqueio
 *                 example: "2026-07-15T09:00:00"
 *               fim:
 *                 type: string
 *                 format: date-time
 *                 description: Fim do bloqueio
 *                 example: "2026-07-15T11:00:00"
 *               motivo:
 *                 type: string
 *                 description: Motivo do bloqueio (opcional)
 *                 example: "Consulta Médica"
 *     responses:
 *       201:
 *         description: Horário bloqueado com sucesso
 *       400:
 *         description: Parâmetros inválidos ou data final menor que inicial
 *       404:
 *         description: Profissional não encontrado
 */
router.post('/agenda/blocks', auth, admin, BlockedHourController.store);

/**
 * @swagger
 * /agenda/availability:
 *   get:
 *     summary: Consultar slots de horários disponíveis de um profissional em uma data para um serviço
 *     tags: [Agenda]
 *     parameters:
 *       - in: query
 *         name: professional_id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID do profissional
 *       - in: query
 *         name: date
 *         schema:
 *           type: string
 *           format: date
 *         required: true
 *         description: Data da consulta no formato YYYY-MM-DD
 *         example: "2026-07-15"
 *       - in: query
 *         name: service_id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID do serviço (para calcular a duração)
 *     responses:
 *       200:
 *         description: Lista de slots livres obtida com sucesso
 *       400:
 *         description: Parâmetros obrigatórios ausentes ou formato inválido
 *       404:
 *         description: Profissional ou serviço não encontrado
 */
router.get('/agenda/availability', agendaController.availability);

module.exports = router;