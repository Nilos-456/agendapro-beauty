const { Appointment } = require('../../models'); // Sobe duas pastas para achar o models na raiz

module.exports = {
  // 1. Listar todos os agendamentos
  async index(req, res) {
    try {
      const appointments = await Appointment.findAll();
      return res.status(200).json(appointments);
    } catch (error) {
      return res.status(500).json({ error: 'Erro ao listar agendamentos.', details: error.message });
    }
  },

  // 2. Criar um novo agendamento
  async store(req, res) {
    try {
      const { professional_id, service_id, data_hora, status } = req.body;

      // Validação rápida de campos obrigatórios
      if (!professional_id || !service_id || !data_hora) {
        return res.status(400).json({ error: 'Profissional, serviço e data/hora são obrigatórios.' });
      }

      const newAppointment = await Appointment.create({ professional_id, service_id, data_hora, status });
      return res.status(201).json(newAppointment);
    } catch (error) {
      return res.status(500).json({ error: 'Erro ao criar agendamento.', details: error.message });
    }
  },

  // 3. Atualizar um agendamento
  async update(req, res) {
    try {
      const { id } = req.params;
      const { professional_id, service_id, data_hora, status } = req.body;

      const appointment = await Appointment.findByPk(id);
      if (!appointment) {
        return res.status(404).json({ error: 'Agendamento não encontrado.' });
      }

      await appointment.update({ professional_id, service_id, data_hora, status });
      return res.status(200).json(appointment);
    } catch (error) {
      return res.status(500).json({ error: 'Erro ao atualizar agendamento.', details: error.message });
    }
  },

  // 4. Deletar um agendamento
  async delete(req, res) {
    try {
      const { id } = req.params;

      const appointment = await Appointment.findByPk(id);
      if (!appointment) {
        return res.status(404).json({ error: 'Agendamento não encontrado.' });
      }

      await appointment.destroy();
      return res.status(200).json({ message: 'Agendamento deletado com sucesso.' });
    } catch (error) {
      return res.status(500).json({ error: 'Erro ao deletar agendamento.', details: error.message });
    }
  }
};
