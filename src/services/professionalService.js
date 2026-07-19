// Camada de serviços para lógica de negócio de profissionais
const { Professional, HourWork, Service } = require('../../models');

class ProfessionalService {
  /**
   * Listar todos os profissionais
   */
  async listAll(filters = {}) {
    try {
      const where = {};

      if (filters.ativo !== undefined) {
        if (filters.ativo !== 'all') {
          where.ativo = filters.ativo === 'true' || filters.ativo === true;
        }
      } else {
        where.ativo = true;
      }

      const professionals = await Professional.findAll({ where });
      return professionals;
    } catch (error) {
      throw new Error(`Erro ao listar profissionais: ${error.message}`);
    }
  }

  /**
   * Buscar profissional por ID
   */
  async findById(id) {
    try {
      const professional = await Professional.findByPk(id);
      if (!professional) {
        throw new Error('Profissional não encontrado');
      }
      return professional;
    } catch (error) {
      throw new Error(`Erro ao buscar profissional: ${error.message}`);
    }
  }

  /**
   * Criar novo profissional
   */
  async create(data) {
    try {
      const { nome, especialidade, telefone, ativo } = data;

      if (!nome || !especialidade || !telefone) {
        throw new Error('Nome, especialidade e telefone são obrigatórios');
      }

      const professional = await Professional.create({
        nome,
        especialidade,
        telefone,
        ativo: ativo !== undefined ? ativo : true
      });

      // Cadastra automaticamente o expediente padrão: Segunda (1) a Sábado (6), das 08h às 18h
      for (let day = 1; day <= 6; day++) {
        await HourWork.create({
          professional_id: professional.id,
          dia_semana: day,
          hora_inicio: '08:00',
          hora_fim: '18:00'
        });
      }

      // Se a especialidade não existir na tabela de Serviços, adiciona-a automaticamente
      if (especialidade && especialidade.trim() !== '') {
        const allServices = await Service.findAll();
        const match = allServices.find(s => s.nome_servico.trim().toLowerCase() === especialidade.trim().toLowerCase());
        
        if (!match) {
          await Service.create({
            nome_servico: especialidade.trim(),
            preco: 50.00, // Preço padrão sugerido
            duracao: 30,  // Duração padrão sugerida (minutos)
            area_id: 1    // Área padrão
          });
        }
      }

      return professional;
    } catch (error) {
      throw new Error(`Erro ao criar profissional: ${error.message}`);
    }
  }

  /**
   * Atualizar profissional
   */
  async update(id, data) {
    try {
      const professional = await Professional.findByPk(id);
      if (!professional) {
        throw new Error('Profissional não encontrado');
      }

      await professional.update(data);
      return professional;
    } catch (error) {
      throw new Error(`Erro ao atualizar profissional: ${error.message}`);
    }
  }

  /**
   * Deletar profissional (soft delete)
   */
  async delete(id) {
    try {
      const professional = await Professional.findByPk(id);
      if (!professional) {
        throw new Error('Profissional não encontrado');
      }

      // Soft delete - apenas marca como inativo
      await professional.update({ ativo: false });
      return { message: 'Profissional deletado com sucesso' };
    } catch (error) {
      throw new Error(`Erro ao deletar profissional: ${error.message}`);
    }
  }

  /**
   * Buscar profissional por especialidade
   */
  async findBySpecialty(especialidade) {
    try {
      const professionals = await Professional.findAll({
        where: { especialidade, ativo: true }
      });
      return professionals;
    } catch (error) {
      throw new Error(`Erro ao buscar profissional por especialidade: ${error.message}`);
    }
  }
}

module.exports = new ProfessionalService();
