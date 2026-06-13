const { Service } = require('../../models');

class ServiceService {
  // Busca todos os serviços
  static async getAllServices() {
    return await Service.findAll();
  }

  // Grava a lista de serviços em lote
  static async createBulkServices(servicesData) {
    return await Service.bulkCreate(servicesData);
  }

  // Busca um serviço específico pelo ID
  static async getServiceById(id) {
    return await Service.findByPk(id);
  }

  // Atualiza um serviço existente
  static async updateService(id, updateData) {
    const service = await Service.findByPk(id);
    if (!service) return null;
    return await service.update(updateData);
  }

  // Deleta um serviço do banco
  static async deleteService(id) {
    const service = await Service.findByPk(id);
    if (!service) return false;
    await service.destroy();
    return true;
  }
}

module.exports = ServiceService;
