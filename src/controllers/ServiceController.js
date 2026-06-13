const ServiceService = require('../services/serviceService');

module.exports = {
  // 1. Listar todos os serviços
  async index(req, res) {
    try {
      const services = await ServiceService.getAllServices();
      return res.status(200).json(services);
    } catch (error) {
      console.error('Erro no index de serviços:', error);
      return res.status(500).json({ error: 'Erro ao buscar serviços.', details: error.message });
    }
  },

  // 2. Cadastro em Massa (Bulk Create)
  async store(req, res) {
    try {
      const servicesList = req.body;
      if (!Array.isArray(servicesList) || servicesList.length === 0) {
        return res.status(400).json({ error: 'O corpo da requisição deve ser uma lista [] de serviços.' });
      }
      await ServiceService.createBulkServices(servicesList);
      return res.status(201).json({
        message: 'Lista de serviços salva com sucesso!',
        count: servicesList.length
      });
    } catch (error) {
      console.error('Erro no store de serviços:', error);
      return res.status(500).json({ error: 'Erro ao salvar a lista de serviços no banco.', details: error.message });
    }
  },

  // 3. Atualizar um Serviço (PUT)
  async update(req, res) {
    try {
      const { id } = req.params;
      const updatedService = await ServiceService.updateService(id, req.body);
      
      if (!updatedService) {
        return res.status(404).json({ error: 'Serviço não encontrado.' });
      }

      return res.status(200).json({
        message: 'Serviço atualizado com sucesso!',
        data: updatedService
      });
    } catch (error) {
      console.error('Erro no update de serviços:', error);
      return res.status(400).json({ error: 'Erro ao atualizar o serviço.', details: error.message });
    }
  },

  // 4. Excluir um Serviço (DELETE)
  async delete(req, res) {
    try {
      const { id } = req.params;
      const deleted = await ServiceService.deleteService(id);

      if (!deleted) {
        return res.status(404).json({ error: 'Serviço não encontrado.' });
      }

      return res.status(200).json({ message: 'Serviço excluído com sucesso!' });
    } catch (error) {
      console.error('Erro no delete de serviços:', error);
      return res.status(500).json({ error: 'Erro ao excluir o serviço.', details: error.message });
    }
  }
};
