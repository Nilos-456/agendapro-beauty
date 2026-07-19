const appointmentService = require('../services/appointmentService');

module.exports = {
  // 1. Listar todos os agendamentos com filtros opcionais
  async index(req, res, next) {
    try {
      const filters = req.query;
      const appointments = await appointmentService.listAll(filters);
      return res.status(200).json({
        success: true,
        count: appointments.length,
        data: appointments
      });
    } catch (error) {
      next(error);
    }
  },

  // 2. Criar novo agendamento
  async store(req, res, next) {
    try {
      const { professional_id, service_id, user_id, data_hora, status } = req.body;

      // Validação básica
      if (!professional_id || !service_id || !data_hora) {
        return res.status(400).json({
          success: false,
          error: 'Profissional, serviço e data/hora são obrigatórios.'
        });
      }

      const newAppointment = await appointmentService.create({
        professional_id,
        service_id,
        user_id,
        data_hora,
        status
      });

      return res.status(201).json({
        success: true,
        message: 'Agendamento realizado com sucesso!',
        data: newAppointment
      });
    } catch (error) {
      next(error);
    }
  },

  // 3. Buscar agendamento por ID
  async show(req, res, next) {
    try {
      const { id } = req.params;
      const appointment = await appointmentService.findById(id);
      return res.status(200).json({
        success: true,
        data: appointment
      });
    } catch (error) {
      next(error);
    }
  },

  // 4. Atualizar agendamento
  async update(req, res, next) {
    try {
      const { id } = req.params;
      const { professional_id, service_id, data_hora, status } = req.body;

      const appointment = await appointmentService.update(id, {
        professional_id,
        service_id,
        data_hora,
        status
      });

      return res.status(200).json({
        success: true,
        message: 'Agendamento atualizado com sucesso!',
        data: appointment
      });
    } catch (error) {
      next(error);
    }
  },

  // 5. Deletar agendamento
  async delete(req, res, next) {
    try {
      const { id } = req.params;
      await appointmentService.delete(id);

      return res.status(200).json({
        success: true,
        message: 'Agendamento deletado com sucesso.'
      });
    } catch (error) {
      next(error);
    }
  },

  // 6. Listar agendamentos de um profissional específico
  async listByProfessional(req, res, next) {
    try {
      const { professionalId } = req.params;
      const appointments = await appointmentService.listByProfessional(professionalId);

      return res.status(200).json({
        success: true,
        count: appointments.length,
        data: appointments
      });
    } catch (error) {
      next(error);
    }
  },

  // 7. Listar agendamentos de um usuário específico
  async listByUser(req, res, next) {
    try {
      const { userId } = req.params;
      const appointments = await appointmentService.listByUser(userId);

      return res.status(200).json({
        success: true,
        count: appointments.length,
        data: appointments
      });
    } catch (error) {
      next(error);
    }
  },

  // 8. Cancelar agendamento (lógico)
  async cancel(req, res, next) {
    try {
      const { id } = req.params;
      const appointment = await appointmentService.cancel(id);

      return res.status(200).json({
        success: true,
        message: 'Agendamento cancelado com sucesso!',
        data: appointment
      });
    } catch (error) {
      if (error.message.includes('não encontrado')) {
        return res.status(404).json({ success: false, error: error.message });
      }
      if (error.message.includes('antecedência') || error.message.includes('passou') || error.message.includes('cancelado')) {
        return res.status(400).json({ success: false, error: error.message });
      }
      next(error);
    }
  },

  // 9. Reagendar agendamento
  async reschedule(req, res, next) {
    try {
      const { id } = req.params;
      const { professional_id, service_id, data_hora } = req.body;

      const newAppointment = await appointmentService.reschedule(id, {
        professional_id,
        service_id,
        data_hora
      });

      return res.status(200).json({
        success: true,
        message: 'Agendamento reagendado com sucesso!',
        data: newAppointment
      });
    } catch (error) {
      if (error.message.includes('não encontrado')) {
        return res.status(404).json({ success: false, error: error.message });
      }
      if (error.message.includes('antecedência') || error.message.includes('conflito') || error.message.includes('passou') || error.message.includes('bloqueado') || error.message.includes('atende') || error.message.includes('cancelado')) {
        return res.status(400).json({ success: false, error: error.message });
      }
      next(error);
    }
  }
};