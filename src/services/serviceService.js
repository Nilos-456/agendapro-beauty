const { Service } = require('../../models');

class ServiceService {
  // Busca todos os serviços no banco
  static async getAllServices() {
    return await Service.findAll();
  }

  // Grava a lista de serviços (em lote / bulk) no banco
  static async createBulkServices(servicesData) {
    return await Service.bulkCreate(servicesData);
  }
}

module.exports = ServiceService;