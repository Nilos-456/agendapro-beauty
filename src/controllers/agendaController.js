const agendaService = require('../services/agendaService');

module.exports = {
  async availability(req, res, next) {
    try {
      const { professional_id, date, service_id } = req.query;

      if (!professional_id || !date || !service_id) {
        return res.status(400).json({ error: 'Parâmetros professional_id, date e service_id são obrigatórios na query.' });
      }

      const slots = await agendaService.getAvailability(
        parseInt(professional_id),
        date,
        parseInt(service_id)
      );

      return res.status(200).json({
        success: true,
        count: slots.length,
        data: slots
      });
    } catch (error) {
      if (error.message.includes('não encontrado')) {
        return res.status(404).json({ error: error.message });
      }
      if (error.message.includes('Formato de data')) {
        return res.status(400).json({ error: error.message });
      }
      next(error);
    }
  }
};
