const { Appointment, Professional, Service } = require('../../models');

module.exports = {
  // 1. Criar um novo agendamento individual (O seu código original)
  async create(req, res) {
    try {
      const { data_hora, status, observacoes, professional_id, service_id } = req.body;

      // Validação simples: checar se o profissional e o serviço existem antes de agendar
      const professionalExists = await Professional.findByPk(professional_id);
      const serviceExists = await Service.findByPk(service_id);

      if (!professionalExists || !serviceExists) {
        return res.status(404).json({ 
          error: 'Profissional ou Serviço não encontrado para realizar o agendamento.' 
        });
      }

      const appointment = await Appointment.create({
        data_hora,
        status,
        observacoes,
        professional_id,
        service_id
      });

      return res.status(201).json(appointment);
    } catch (error) {
      return res.status(500).json({ error: 'Erro ao criar agendamento.', details: error.message });
    }
  },

  // 2. NOVA: Rota de Cadastro em Massa (Bulk Create para os 25 agendamentos)
  async storeBulk(req, res) {
    try {
      const appointmentsList = req.body;

      if (!Array.isArray(appointmentsList) || appointmentsList.length === 0) {
        return res.status(400).json({ error: 'O corpo da requisição deve ser uma lista [] de agendamentos.' });
      }

      // Cria todos de uma vez no banco de dados
      const createdAppointments = await Appointment.bulkCreate(appointmentsList);
      return res.status(201).json(createdAppointments);
    } catch (error) {
      console.error('Erro detalhado no storeBulk de agendamentos:', error);
      return res.status(500).json({ error: 'Erro ao salvar a lista de agendamentos no banco.', details: error.message });
    }
  },

  // 3. Listar todos os agendamentos trazendo os dados vinculados
  async list(req, res) {
    try {
      const appointments = await Appointment.findAll({
        include: [
          { model: Professional, as: 'professional', attributes: ['id', 'nome'] },
          { model: Service, as: 'service', attributes: ['id', 'nome_servico', 'preco'] } // Ajustado para nome_servico que usamos no lote anterior
        ]
      });
      return res.status(200).json(appointments);
    } catch (error) {
      return res.status(500).json({ error: 'Erro ao buscar agendamentos.', details: error.message });
    }
  }
};