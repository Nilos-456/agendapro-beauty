const serviceService = require('../services/serviceService');

module.exports = {
  // 1. Listar todos os serviços com filtro opcional por area_id
  async index(req, res, next) {
    try {
      const filters = req.query;
      const services = await serviceService.listAll(filters);

      return res.status(200).json({
        success: true,
        count: services.length,
        data: services
      });
    } catch (error) {
      next(error);
    }
  },

  // 2. Buscar serviço por ID
  async show(req, res, next) {
    try {
      const { id } = req.params;
      const service = await serviceService.findById(id);

      return res.status(200).json({
        success: true,
        data: service
      });
    } catch (error) {
      next(error);
    }
  },

  // 3. Criar um único serviço
  async store(req, res, next) {
    try {
      const { area_id, nome_servico, preco, duracao } = req.body;

      // Validação básica
      if (!nome_servico || !preco || !duracao) {
        return res.status(400).json({
          success: false,
          error: 'Nome do serviço, preço e duração são obrigatórios.'
        });
      }

      const newService = await serviceService.create({
        area_id,
        nome_servico,
        preco,
        duracao
      });

      return res.status(201).json({
        success: true,
        message: 'Serviço criado com sucesso!',
        data: newService
      });
    } catch (error) {
      next(error);
    }
  },

  // 4. Cadastro em Massa (Bulk Create)
  async bulkCreate(req, res, next) {
    try {
      const servicesList = req.body;

      if (!Array.isArray(servicesList) || servicesList.length === 0) {
        return res.status(400).json({
          success: false,
          error: 'O corpo da requisição deve ser uma lista [] de serviços.'
        });
      }

      const createdServices = await serviceService.bulkCreate(servicesList);

      return res.status(201).json({
        success: true,
        message: 'Lista de serviços salva com sucesso!',
        count: createdServices.length,
        data: createdServices
      });
    } catch (error) {
      next(error);
    }
  },

  // 5. Atualizar um serviço
  async update(req, res, next) {
    try {
      const { id } = req.params;
      const { area_id, nome_servico, preco, duracao } = req.body;

      const service = await serviceService.update(id, {
        area_id,
        nome_servico,
        preco,
        duracao
      });

      return res.status(200).json({
        success: true,
        message: 'Serviço atualizado com sucesso!',
        data: service
      });
    } catch (error) {
      next(error);
    }
  },

  // 6. Deletar um serviço
  async delete(req, res, next) {
    try {
      const { id } = req.params;
      await serviceService.delete(id);

      return res.status(200).json({
        success: true,
        message: 'Serviço excluído com sucesso!'
      });
    } catch (error) {
      next(error);
    }
  }
};