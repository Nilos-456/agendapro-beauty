const AppointmentService = require('../services/appointmentService');

class AppointmentController {
  static async createBulk(req, res) {
    try {
      // O Controller agora delega a persistência para a camada de Service
      const appointments = await AppointmentService.createBulkAppointments(req.body);
      
      return res.status(201).json({ 
        message: 'Lista de agendamentos salva com sucesso!', 
        count: appointments.length 
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
