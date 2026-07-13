const agendaService = require('../services/agendaService');

module.exports = {
  async store(req, res, next) {
    try {
      const { professional_id, dia_semana, hora_inicio, hora_fim } = req.body;

      if (professional_id === undefined || dia_semana === undefined || !hora_inicio || !hora_fim) {
        return res.status(400).json({ error: 'Campos professional_id, dia_semana, hora_inicio e hora_fim são obrigatórios.' });
      }

      const diaInt = parseInt(dia_semana);
      if (isNaN(diaInt) || diaInt < 0 || diaInt > 6) {
        return res.status(400).json({ error: 'dia_semana deve ser um inteiro entre 0 (domingo) e 6 (sábado).' });
      }

      const hourWork = await agendaService.registerWorkingHours({
        professional_id,
        dia_semana: diaInt,
        hora_inicio,
        hora_fim
      });

      return res.status(201).json({
        success: true,
        message: 'Horário de trabalho registrado com sucesso!',
        data: hourWork
      });
    } catch (error) {
      if (error.message.includes('não encontrado')) {
        return res.status(404).json({ error: error.message });
      }
      next(error);
    }
  }
};