// Camada de serviços para lógica de negócio de agendamentos
const { Appointment, Professional, Service } = require('../../models');

class AppointmentService {
  /**
   * Listar todos os agendamentos com filtros opcionais
   */
  async listAll(filters = {}) {
    try {
      const where = {};
      if (filters.professional_id) where.professional_id = filters.professional_id;
      if (filters.status) where.status = filters.status;

      const appointments = await Appointment.findAll({
        where,
        include: [
          {
            model: Professional,
            as: 'professional',
            attributes: ['id', 'nome', 'especialidade']
          },
          {
            model: Service,
            as: 'service'
          }
        ],
        order: [['data_hora', 'ASC']]
      });

      return appointments;
    } catch (error) {
      throw new Error(`Erro ao listar agendamentos: ${error.message}`);
    }
  }

  /**
   * Buscar agendamento por ID
   */
  async findById(id) {
    try {
      const appointment = await Appointment.findByPk(id, {
        include: [
          {
            model: Professional,
            as: 'professional',
            attributes: ['id', 'nome', 'especialidade', 'telefone']
          },
          {
            model: Service,
            as: 'service'
          }
        ]
      });

      if (!appointment) {
        throw new Error('Agendamento não encontrado');
      }

      return appointment;
    } catch (error) {
      throw new Error(`Erro ao buscar agendamento: ${error.message}`);
    }
  }

  /**
   * Criar novo agendamento
   */
  async create(data) {
    try {
      const { professional_id, service_id, data_hora, status } = data;

      // Validar se profissional existe
      const professional = await Professional.findByPk(professional_id);
      if (!professional) {
        throw new Error(`Profissional com ID ${professional_id} não encontrado`);
      }

      // Validar se serviço existe
      const service = await Service.findByPk(service_id);
      if (!service) {
        throw new Error(`Serviço com ID ${service_id} não encontrado`);
      }

      // Validar horário duplicado
      const existingAppointment = await Appointment.findOne({
        where: {
          professional_id,
          data_hora: new Date(data_hora)
        }
      });

      if (existingAppointment) {
        throw new Error('Este profissional já possui um agendamento neste horário');
      }

      const appointment = await Appointment.create({
        professional_id,
        service_id,
        data_hora,
        status: status || 'agendado'
      });

      return appointment;
    } catch (error) {
      throw new Error(`Erro ao criar agendamento: ${error.message}`);
    }
  }

  /**
   * Atualizar agendamento
   */
  async update(id, data) {
    try {
      const appointment = await Appointment.findByPk(id);
      if (!appointment) {
        throw new Error('Agendamento não encontrado');
      }

      await appointment.update(data);
      return appointment;
    } catch (error) {
      throw new Error(`Erro ao atualizar agendamento: ${error.message}`);
    }
  }

  /**
   * Deletar agendamento
   */
  async delete(id) {
    try {
      const appointment = await Appointment.findByPk(id);
      if (!appointment) {
        throw new Error('Agendamento não encontrado');
      }

      await appointment.destroy();
      return { message: 'Agendamento deletado com sucesso' };
    } catch (error) {
      throw new Error(`Erro ao deletar agendamento: ${error.message}`);
    }
  }

  /**
   * Listar agendamentos de um profissional
   */
  async listByProfessional(professionalId) {
    try {
      const appointments = await Appointment.findAll({
        where: { professional_id: professionalId },
        include: [
          {
            model: Service,
            as: 'service'
          }
        ],
        order: [['data_hora', 'ASC']]
      });

      return appointments;
    } catch (error) {
      throw new Error(`Erro ao listar agendamentos do profissional: ${error.message}`);
    }
  }
}

module.exports = new AppointmentService();
