const { HourWork, BlockedHour, Professional, Service, Appointment } = require('../../models');
const { Op } = require('sequelize');

class AgendaService {
  /**
   * Cadastrar ou atualizar horário de trabalho de um profissional
   */
  async registerWorkingHours(data) {
    const { professional_id, dia_semana, hora_inicio, hora_fim } = data;

    // Verificar se o profissional existe
    const professional = await Professional.findByPk(professional_id);
    if (!professional) {
      throw new Error(`Profissional com ID ${professional_id} não encontrado`);
    }

    // Verificar se já existe horário cadastrado para este dia da semana
    let hourWork = await HourWork.findOne({
      where: { professional_id, dia_semana }
    });

    if (hourWork) {
      // Atualizar se já existir
      await hourWork.update({ hora_inicio, hora_fim });
    } else {
      // Criar se não existir
      hourWork = await HourWork.create({ professional_id, dia_semana, hora_inicio, hora_fim });
    }

    return hourWork;
  }

  /**
   * Cadastrar um bloqueio manual de horário
   */
  async registerBlock(data) {
    const { professional_id, inicio, fim, motivo } = data;

    const professional = await Professional.findByPk(professional_id);
    if (!professional) {
      throw new Error(`Profissional com ID ${professional_id} não encontrado`);
    }

    const dataInicio = new Date(inicio);
    const dataFim = new Date(fim);

    if (dataInicio >= dataFim) {
      throw new Error('A data de início deve ser anterior à data de fim do bloqueio');
    }

    const block = await BlockedHour.create({
      professional_id,
      inicio: dataInicio,
      fim: dataFim,
      motivo
    });

    return block;
  }

  /**
   * Obter disponibilidade de slots para um profissional em uma data específica
   */
  async getAvailability(professionalId, dateString, serviceId) {
    // 1. Validar se o serviço existe
    const service = await Service.findByPk(serviceId);
    if (!service) {
      throw new Error(`Serviço com ID ${serviceId} não encontrado`);
    }

    // 2. Validar se o profissional existe
    const professional = await Professional.findByPk(professionalId);
    if (!professional) {
      throw new Error(`Profissional com ID ${professionalId} não encontrado`);
    }

    // Parse da data string "YYYY-MM-DD" em tempo local do servidor
    const parts = dateString.split('-');
    if (parts.length !== 3) {
      throw new Error('Formato de data inválido. Use YYYY-MM-DD');
    }
    const year = parseInt(parts[0]);
    const month = parseInt(parts[1]) - 1;
    const day = parseInt(parts[2]);

    const queryDate = new Date(year, month, day);
    const diaSemana = queryDate.getDay(); // 0 = Domingo, 6 = Sábado

    // 3. Buscar horários de trabalho para este dia da semana
    const workingHours = await HourWork.findAll({
      where: { professional_id: professionalId, dia_semana: diaSemana }
    });

    if (workingHours.length === 0) {
      return []; // Profissional não trabalha nesse dia
    }

    // 4. Buscar agendamentos ativos para este profissional na data
    const startOfDay = new Date(year, month, day, 0, 0, 0, 0);
    const endOfDay = new Date(year, month, day, 23, 59, 59, 999);

    const appointments = await Appointment.findAll({
      where: {
        professional_id: professionalId,
        status: { [Op.notIn]: ['cancelado'] },
        data_hora: {
          [Op.between]: [startOfDay, endOfDay]
        }
      },
      include: [{ model: Service, as: 'service' }]
    });

    // 5. Buscar bloqueios de horário ativos para a data
    const blockedHours = await BlockedHour.findAll({
      where: {
        professional_id: professionalId,
        [Op.or]: [
          {
            inicio: { [Op.between]: [startOfDay, endOfDay] }
          },
          {
            fim: { [Op.between]: [startOfDay, endOfDay] }
          },
          {
            inicio: { [Op.lte]: startOfDay },
            fim: { [Op.gte]: endOfDay }
          }
        ]
      }
    });

    const availableSlots = [];
    const serviceDurationMs = service.duracao * 60 * 1000;

    // 6. Gerar slots a partir dos horários de expediente
    for (const work of workingHours) {
      const [sh, sm] = work.hora_inicio.split(':');
      const [eh, em] = work.hora_fim.split(':');

      const shiftStart = new Date(year, month, day, parseInt(sh), parseInt(sm), 0, 0);
      const shiftEnd = new Date(year, month, day, parseInt(eh), parseInt(em), 0, 0);

      // Loop de slots a cada 30 minutos
      let slotStart = new Date(shiftStart);
      const now = new Date();

      while (true) {
        const slotEnd = new Date(slotStart.getTime() + serviceDurationMs);

        // Se o slot ultrapassar o fim da jornada, interrompe a geração deste turno
        if (slotEnd > shiftEnd) {
          break;
        }

        // Se a data consultada for hoje, ignora horários passados
        if (slotStart >= now || queryDate.toDateString() !== now.toDateString()) {
          let hasOverlap = false;

          // Verificar sobreposição com agendamentos
          for (const app of appointments) {
            const appStart = new Date(app.data_hora);
            const appEnd = new Date(appStart.getTime() + app.service.duracao * 60 * 1000);

            // Condição de sobreposição: início do slot antes do fim do agendamento E fim do slot depois do início do agendamento
            if (slotStart < appEnd && slotEnd > appStart) {
              hasOverlap = true;
              break;
            }
          }

          // Verificar sobreposição com bloqueios manuais
          if (!hasOverlap) {
            for (const block of blockedHours) {
              const blockStart = new Date(block.inicio);
              const blockEnd = new Date(block.fim);

              if (slotStart < blockEnd && slotEnd > blockStart) {
                hasOverlap = true;
                break;
              }
            }
          }

          if (!hasOverlap) {
            const formattedTime = slotStart.toTimeString().split(' ')[0].substring(0, 5);
            availableSlots.push({
              time: formattedTime,
              dateTime: slotStart.toISOString()
            });
          }
        }

        // Incrementa o slotStart em 30 minutos
        slotStart = new Date(slotStart.getTime() + 30 * 60 * 1000);
      }
    }

    return availableSlots;
  }
}

module.exports = new AgendaService();
