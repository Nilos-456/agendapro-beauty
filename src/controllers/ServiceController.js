const { Service } = require('../../models');

module.exports = {
  // 1. Rota de Listagem de Serviços
  async index(req, res) {
    try {
      const services = await Service.findAll();
      return res.status(200).json(services);
    } catch (error) {
      console.error('Erro no index de serviços:', error);
      return res.status(500).json({ error: 'Erro ao buscar serviços.' });
    }
  },

  // 2. Rota de Cadastro em Massa (Bulk Create Ajustada)
  async store(req, res) {
    try {
      const servicesList = req.body;

      if (!Array.isArray(servicesList) || servicesList.length === 0) {
        return res.status(400).json({ error: 'O corpo da requisição deve ser uma lista [] de serviços.' });
      }

      // Salva a lista diretamente no banco usando as colunas idênticas do model
      const createdServices = await Service.bulkCreate(servicesList);
      return res.status(201).json(createdServices);
    } catch (error) {
      console.error('Erro detalhado no store de serviços:', error);
      return res.status(500).json({ error: 'Erro ao salvar a lista de serviços no banco.' });
    }
  }
};
