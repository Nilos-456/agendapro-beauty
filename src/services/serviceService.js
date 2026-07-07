// Camada de serviços para lógica de negócio de serviços
const { Service } = require('../../models');

class ServiceService {
  /**
   * Listar todos os serviços com filtro opcional por area_id
   */
  async listAll(filters = {}) {
    try {
      const where = {};
      if (filters.area_id) {
        where.area_id = filters.area_id;
      }

      const services = await Service.findAll({
        where,
        order: [['nome_servico', 'ASC']]
      });

      return services;
    } catch (error) {
      throw new Error(`Erro ao listar serviços: ${error.message}`);
    }
  }

  /**
   * Buscar serviço por ID
   */
  async findById(id) {
    try {
      const service = await Service.findByPk(id);
      if (!service) {
        throw new Error('Serviço não encontrado');
      }
      return service;
    } catch (error) {
      throw new Error(`Erro ao buscar serviço: ${error.message}`);
    }
  }

  /**
   * Criar novo serviço
   */
  async create(data) {
    try {
      const { area_id, nome_servico, preco, duracao } = data;

      if (!nome_servico || !preco || !duracao) {
        throw new Error('Nome do serviço, preço e duração são obrigatórios');
      }

      const service = await Service.create({
        area_id,
        nome_servico,
        preco,
        duracao
      });

      return service;
    } catch (error) {
      throw new Error(`Erro ao criar serviço: ${error.message}`);
    }
  }

  /**
   * Atualizar serviço
   */
  async update(id, data) {
    try {
      const service = await Service.findByPk(id);
      if (!service) {
        throw new Error('Serviço não encontrado');
      }

      await service.update(data);
      return service;
    } catch (error) {
      throw new Error(`Erro ao atualizar serviço: ${error.message}`);
    }
  }

  /**
   * Deletar serviço
   */
  async delete(id) {
    try {
      const service = await Service.findByPk(id);
      if (!service) {
        throw new Error('Serviço não encontrado');
      }

      await service.destroy();
      return { message: 'Serviço deletado com sucesso' };
    } catch (error) {
      throw new Error(`Erro ao deletar serviço: ${error.message}`);
    }
  }

  /**
   * Criar múltiplos serviços em massa
   */
  async bulkCreate(services) {
    try {
      if (!Array.isArray(services) || services.length === 0) {
        throw new Error('Deve fornecer um array de serviços');
      }

      const createdServices = await Service.bulkCreate(services);
      return createdServices;
    } catch (error) {
      throw new Error(`Erro ao criar serviços em massa: ${error.message}`);
    }
  }
}

module.exports = new ServiceService();
