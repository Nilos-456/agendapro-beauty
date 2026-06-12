const ServiceService = require('../services/serviceService');

module.exports = {
  // 1. Rota de Listagem de Serviços
  async index(req, res) {
    try {
      const services = await ServiceService.getAllServices();
      return res.status(200).json(services);
    } catch (error) {
      console.error('Erro no index de serviços:', error);
      return res.status(500).json({ error: 'Erro ao buscar serviços.', details: error.message });
    }
  },

  // 2. Rota de Cadastro em Massa (Bulk Create Protegido)
  async store(req, res) {
    try {
      const servicesList = req.body;

      // Validação obrigatória da Sprint 2!
      if (!Array.isArray(servicesList) || servicesList.length === 0) {
        return res.status(400).json({ error: 'O corpo da requisição deve ser uma lista [] de serviços.' });
      }

      // Chama a camada de serviço
      await ServiceService.createBulkServices(servicesList);
      
      return res.status(201).json({
        message: 'Lista de serviços salva com sucesso!',
        count: servicesList.length
      });
    } catch (error) {
      console.error('Erro detalhado no store de serviços:', error);
      return res.status(500).json({ error: 'Erro ao salvar a lista de serviços no banco.', details: error.message });
    }
  }
};
