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
   * Criar novo agendamento com validações completas de agenda (Sprints 3 e 4)
   */
  async create(data) {
    try {
      const { professional_id, service_id, data_hora, status } = data;

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

      // 3. Regra de Negócio: Calcular dinamicamente as datas de início e fim
      const dataInicio = new Date(data_hora);
      const dataFim = new Date(dataInicio.getTime() + service.duracao * 60000); // base em minutos

      // Impedir agendamentos no passado
      if (dataInicio < new Date()) {
        throw new Error('Não é possível criar um agendamento em uma data ou horário passado');
      }

      // 4. Validação da Sprint 3: Verificar Horário de Trabalho do Profissional
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

      // 5. Validação da Sprint 3: Verificar se o horário está bloqueado manualmente
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

      // 6. Validação da Sprint 4: Impedir duplo agendamento (Verificar sobreposição de horários no banco)
      const conflitoAgendamento = await Appointment.findOne({
        where: {
          professional_id,
          status: { [Op.notIn]: ['cancelado'] }, // Ignora agendamentos cancelados
          [Op.or]: [
            {
              data_hora: { [Op.lt]: dataFim },
              // Se sua migration usa o campo calculado data_hora_fim do diagrama ER:
              // data_hora_fim: { [Op.gt]: dataInicio }
            }
          ]
        }
      });

      // Checagem simples baseada na estrutura padrão do Sequelize
      if (conflitoAgendamento) {
        throw new Error('Este profissional já possui um agendamento conflitante neste período');
      }

      // 7. Cria o agendamento passando as informações completas para o banco
      const appointment = await Appointment.create({
        professional_id,
        service_id,
        data_hora: dataInicio,
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