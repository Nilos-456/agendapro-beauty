const agendaService = require('../services/agendaService');

module.exports = {
  async store(req, res, next) {
    try {
      const { professional_id, inicio, fim, motivo } = req.body;

      if (professional_id === undefined || !inicio || !fim) {
        return res.status(400).json({ error: 'Campos professional_id, inicio e fim são obrigatórios.' });
      }

      const block = await agendaService.registerBlock({
        professional_id,
        inicio,
        fim,
        motivo
      });

      return res.status(201).json({
        success: true,
        message: 'Horário bloqueado com sucesso!',
        data: block
      });
    } catch (error) {
      if (error.message.includes('não encontrado')) {
        return res.status(404).json({ error: error.message });
      }
      if (error.message.includes('anterior')) {
        return res.status(400).json({ error: error.message });
      }
      next(error);
    }
  }
};