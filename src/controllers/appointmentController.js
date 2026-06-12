const AppointmentService = require('../services/appointmentService');

class AppointmentController {
  static async createBulk(req, res) {
    try {
      // 1. Garante que o corpo da requisição é um array válido
      if (!Array.isArray(req.body) || req.body.length === 0) {
        return res.status(400).json({ 
          error: 'O corpo da requisição deve ser uma lista [] de agendamentos.' 
        });
      }

      // 2. Chama o serviço para salvar no banco de dados
      await AppointmentService.createBulkAppointments(req.body);
      
      // 3. Em vez de ler 'appointments.length', usamos 'req.body.length'!
      // Isso blinda o código contra qualquer comportamento estranho do Sequelize.
      return res.status(201).json({ 
        message: 'Lista de agendamentos salva com sucesso!', 
        count: req.body.length 
      });

    } catch (error) {
      return res.status(500).json({ 
        error: 'Erro ao salvar a lista de agendamentos no banco.', 
        details: error.message 
      });
    }
  }
}

module.exports = AppointmentController;

