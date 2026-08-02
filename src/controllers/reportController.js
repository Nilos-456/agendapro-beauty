const { Appointment, Professional, Service } = require('../../models');
const { fn, col } = require('sequelize');

module.exports = {
  // Obter consolidados do Dashboard Administrativo
  async getDashboardStats(req, res, next) {
    try {
      // 1. Contagem total de agendamentos agrupada por status
      const statusStats = await Appointment.findAll({
        attributes: [
          'status',
          [fn('COUNT', col('id')), 'count']
        ],
        group: ['status']
      });

      // Mapear resultado para formato mais amigável
      const statusMap = {
        agendado: 0,
        confirmado: 0,
        concluido: 0,
        cancelado: 0
      };
      statusStats.forEach(stat => {
        const status = stat.getDataValue('status');
        const count = parseInt(stat.getDataValue('count'), 10);
        if (statusMap[status] !== undefined) {
          statusMap[status] = count;
        }
      });

      const totalAppointments = Object.values(statusMap).reduce((a, b) => a + b, 0);

      // 2. Ranking de serviços mais solicitados (Top 5)
      const serviceStats = await Appointment.findAll({
        attributes: [
          'service_id',
          [fn('COUNT', col('Appointment.id')), 'count']
        ],
        include: [
          {
            model: Service,
            as: 'service',
            attributes: ['nome_servico']
          }
        ],
        group: ['service_id', 'service.id'],
        order: [[fn('COUNT', col('Appointment.id')), 'DESC']],
        limit: 5
      });

      const topServices = serviceStats.map(stat => ({
        service_id: stat.service_id,
        nome_servico: stat.service ? stat.service.nome_servico : 'Serviço Indefinido',
        count: parseInt(stat.getDataValue('count'), 10)
      }));

      // 3. Ranking de profissionais mais requisitados (Top 5)
      const professionalStats = await Appointment.findAll({
        attributes: [
          'professional_id',
          [fn('COUNT', col('Appointment.id')), 'count']
        ],
        include: [
          {
            model: Professional,
            as: 'professional',
            attributes: ['nome']
          }
        ],
        group: ['professional_id', 'professional.id'],
        order: [[fn('COUNT', col('Appointment.id')), 'DESC']],
        limit: 5
      });

      const topProfessionals = professionalStats.map(stat => ({
        professional_id: stat.professional_id,
        nome_profissional: stat.professional ? stat.professional.nome : 'Profissional Indefinido',
        count: parseInt(stat.getDataValue('count'), 10)
      }));

      return res.status(200).json({
        success: true,
        data: {
          totals: {
            total: totalAppointments,
            ...statusMap
          },
          topServices,
          topProfessionals
        }
      });
    } catch (error) {
      next(error);
    }
  }
};
