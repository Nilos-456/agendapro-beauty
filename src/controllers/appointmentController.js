const { Appointment, Professional, Service } = require('../../models');
const { Op } = require('sequelize'); // Importa os operadores do Sequelize para fazer buscas avançadas

module.exports = {
  // 1. Listar todos os agendamentos trazendo dados do Profissional e Serviço
  async index(req, res) {
    try {
      const appointments = await Appointment.findAll({
        include: [
          {
            model: Professional,
            as: 'professional',
            attributes: ['id', 'nome', 'especialidade']
          },
          {
            model: Service,
            as: 'service' // Mantemos o alias exigido para evitar o Erro 500
          }
        ],
        order: [['data_hora', 'ASC']]
      });
      return res.status(200).json(appointments);
    } catch (error) {
      return res.status(500).json({ error: 'Erro ao listar agendamentos.', details: error.message });
    }
  },

  // 2. Criar um novo agendamento com REGRAS DE NEGÓCIO
  async store(req, res) {
    try {
      const { professional_id, service_id, data_hora, status } = req.body;

      // Validação básica de campos preenchidos
      if (!professional_id || !service_id || !data_hora) {
        return res.status(400).json({ error: 'Profissional, serviço e data/hora são obrigatórios.' });
      }

      // REGRA 1: Validar se o Profissional realmente existe no banco
      const professionalExists = await Professional.findByPk(professional_id);
      if (!professionalExists) {
        return res.status(404).json({ error: `Profissional com ID ${professional_id} não foi encontrado.` });
      }

      // REGRA 2: Validar se o Serviço realmente existe no banco
      const serviceExists = await Service.findByPk(service_id);
      if (!serviceExists) {
        return res.status(404).json({ error: `Serviço com ID ${service_id} não foi encontrado.` });
      }

      // REGRA 3: Evitar choque de horário para o mesmo profissional
      const horarioOcupado = await Appointment.findOne({
        where: {
          professional_id,
          data_hora: new Date(data_hora) // Garante a comparação correta de datas
        }
      });

      if (horarioOcupado) {
        return res.status(400).json({ error: 'Este profissional já possui um agendamento neste horário.' });
      }

      // Se passou por todas as regras, cria o agendamento!
      const newAppointment = await Appointment.create({
        professional_id,
        service_id,
        data_hora,
        status: status || 'agendado' // Se não enviar status, assume 'agendado'
      });

      return res.status(201).json({
        message: 'Agendamento realizado com sucesso!',
        data: newAppointment
      });

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