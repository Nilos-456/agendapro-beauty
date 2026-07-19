const professionalService = require('../services/professionalService');

module.exports = {
  // 1. Listar todos os profissionais ativos
  async index(req, res, next) {
    try {
      const filters = req.query;
      const professionals = await professionalService.listAll(filters);
      return res.status(200).json({
        success: true,
        count: professionals.length,
        data: professionals
      });
    } catch (error) {
      next(error);
    }
  },

  // 2. Buscar profissional por ID
  async show(req, res, next) {
    try {
      const { id } = req.params;
      const professional = await professionalService.findById(id);

      return res.status(200).json({
        success: true,
        data: professional
      });
    } catch (error) {
      next(error);
    }
  },

  // 3. Criar novo profissional
  async store(req, res, next) {
    try {
      const { nome, especialidade, telefone, ativo } = req.body;

      // Validação básica
      if (!nome || !especialidade || !telefone) {
        return res.status(400).json({
          success: false,
          error: 'Nome, especialidade e telefone são obrigatórios.'
        });
      }

      const newProfessional = await professionalService.create({
        nome,
        especialidade,
        telefone,
        ativo
      });

      return res.status(201).json({
        success: true,
        message: 'Profissional criado com sucesso!',
        data: newProfessional
      });
    } catch (error) {
      next(error);
    }
  },

  // 4. Atualizar profissional
  async update(req, res, next) {
    try {
      const { id } = req.params;
      const { nome, especialidade, telefone, ativo } = req.body;

      const professional = await professionalService.update(id, {
        nome,
        especialidade,
        telefone,
        ativo
      });

      return res.status(200).json({
        success: true,
        message: 'Profissional atualizado com sucesso!',
        data: professional
      });
    } catch (error) {
      next(error);
    }
  },

  // 5. Deletar profissional (soft delete)
  async delete(req, res, next) {
    try {
      const { id } = req.params;
      await professionalService.delete(id);

      return res.status(200).json({
        success: true,
        message: 'Profissional deletado com sucesso.'
      });
    } catch (error) {
      next(error);
    }
  },

  // 6. Buscar profissionais por especialidade
  async findBySpecialty(req, res, next) {
    try {
      const { especialidade } = req.query;

      if (!especialidade) {
        return res.status(400).json({
          success: false,
          error: 'Especialidade é obrigatória'
        });
      }

      const professionals = await professionalService.findBySpecialty(especialidade);

      return res.status(200).json({
        success: true,
        count: professionals.length,
        data: professionals
      });
    } catch (error) {
      next(error);
    }
  }
};