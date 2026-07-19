// Camada de serviços para lógica de negócio de agendamentos
const { Appointment, Professional, Service, HourWork, BlockedHour } = require('../../models');
const { Op } = require('sequelize');

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
   * Valida as regras de negócio de agendamento (horário de trabalho, bloqueios e conflitos)
   */
  async validateAppointmentRules(professional_id, service_id, data_hora, excludeAppointmentId = null) {
    // 1. Validar se profissional existe
    const professional = await Professional.findByPk(professional_id);
    if (!professional) {
      throw new Error(`Profissional com ID ${professional_id} não encontrado`);
    }

    // 2. Validar se serviço existe para capturar a duração
    const service = await Service.findByPk(service_id);
    if (!service) {
      throw new Error(`Serviço com ID ${service_id} não encontrado`);
    }

    // 3. Calcular data início e fim
    const dataInicio = new Date(data_hora);
    const dataFim = new Date(dataInicio.getTime() + service.duracao * 60000);

    // Impedir agendamentos no passado
    if (dataInicio < new Date()) {
      throw new Error('Não é possível criar ou alterar um agendamento para uma data ou horário passado');
    }

    // 4. Verificar Horário de Trabalho do Profissional
    const diaSemana = dataInicio.getDay(); // 0 = Domingo, 6 = Sábado
    const horaMinutoFormatada = dataInicio.toTimeString().split(' ')[0]; // Formato "HH:MM:SS"

    const horarioTrabalho = await HourWork.findOne({
      where: {
        professional_id,
        dia_semana: diaSemana,
        hora_inicio: { [Op.lte]: horaMinutoFormatada },
        hora_fim: { [Op.gte]: horaMinutoFormatada }
      }
    });

    if (!horarioTrabalho) {
      throw new Error('O profissional não atende no dia ou horário selecionado');
    }

    // 5. Verificar se o horário está bloqueado manualmente
    const bloqueioExistente = await BlockedHour.findOne({
      where: {
        professional_id,
        [Op.or]: [
          {
            inicio: { [Op.lt]: dataFim },
            fim: { [Op.gt]: dataInicio }
          }
        ]
      }
    });

    if (bloqueioExistente) {
      throw new Error('O horário selecionado está bloqueado para este profissional (Folga/Compromisso)');
    }

    // 6. Impedir duplo agendamento (Verificar sobreposição de horários)
    const startOfDay = new Date(dataInicio.getFullYear(), dataInicio.getMonth(), dataInicio.getDate(), 0, 0, 0, 0);
    const endOfDay = new Date(dataInicio.getFullYear(), dataInicio.getMonth(), dataInicio.getDate(), 23, 59, 59, 999);

    const appointmentWhere = {
      professional_id,
      status: { [Op.notIn]: ['cancelado'] },
      data_hora: {
        [Op.between]: [startOfDay, endOfDay]
      }
    };

    if (excludeAppointmentId) {
      appointmentWhere.id = { [Op.ne]: excludeAppointmentId };
    }

    const existingAppointments = await Appointment.findAll({
      where: appointmentWhere,
      include: [{ model: Service, as: 'service' }]
    });

    const conflitoAgendamento = existingAppointments.find(app => {
      const appStart = new Date(app.data_hora);
      const appEnd = new Date(appStart.getTime() + app.service.duracao * 60000);
      return dataInicio < appEnd && dataFim > appStart;
    });

    if (conflitoAgendamento) {
      throw new Error('Este profissional já possui um agendamento conflitante neste período');
    }

    return { dataInicio, dataFim };
  }

  /**
   * Criar novo agendamento com validações completas de agenda (Sprints 3 e 4)
   */
  async create(data) {
    try {
      const { professional_id, service_id, data_hora, status } = data;

      if (!professional_id || !service_id || !data_hora) {
        throw new Error('Profissional, serviço e data/hora são obrigatórios');
      }

      const { dataInicio } = await this.validateAppointmentRules(professional_id, service_id, data_hora);

      const appointment = await Appointment.create({
        professional_id,
        service_id,
        data_hora: dataInicio,
        status: status || 'agendado'
      });

      return appointment;
    } catch (error) {
      throw new Error(error.message);
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

      const professional_id = data.professional_id !== undefined ? data.professional_id : appointment.professional_id;
      const service_id = data.service_id !== undefined ? data.service_id : appointment.service_id;
      const data_hora = data.data_hora !== undefined ? data.data_hora : appointment.data_hora;

      // Executa as validações se algum campo de agendamento de horário mudou
      if (
        professional_id !== appointment.professional_id ||
        service_id !== appointment.service_id ||
        new Date(data_hora).getTime() !== new Date(appointment.data_hora).getTime()
      ) {
        await this.validateAppointmentRules(professional_id, service_id, data_hora, id);
      }

      await appointment.update(data);
      return appointment;
    } catch (error) {
      throw new Error(error.message);
    }
  }

  /**
   * Deletar agendamento (Sprint 4: Com validação de antecedência mínima de 2 horas)
   */
  async delete(id) {
    try {
      const appointment = await Appointment.findByPk(id);
      if (!appointment) {
        throw new Error('Agendamento não encontrado');
      }

      // Regra de Negócio: Validar cancelamento com antecedência mínima de 2 horas
      const agora = new Date();
      const dataHoraAgendamento = new Date(appointment.data_hora);

      if (dataHoraAgendamento < agora) {
        throw new Error('Não é possível cancelar um agendamento de uma data ou horário que já passou');
      }

      // Calcula a diferença de tempo em minutos
      const diferencaMinutos = (dataHoraAgendamento - agora) / (1000 * 60);

      if (diferencaMinutos < 120) { // 120 minutos = 2 horas
        throw new Error('Regra do Estabelecimento: Cancelamentos só são permitidos com no mínimo 2 horas de antecedência');
      }

      await appointment.destroy();
      return { message: 'Agendamento deletado com sucesso' };
    } catch (error) {
      throw new Error(error.message);
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