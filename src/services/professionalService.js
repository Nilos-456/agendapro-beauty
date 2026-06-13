const { Professional } = require('../../models');

class ProfessionalService {
  // 1. Buscar todos os profissionais cadastrados
  static async getAllProfessionals() {
    return await Professional.findAll();
  }

 // 2. Cadastrar uma lista de profissionais em lote (Bulk)
  static async createBulkProfessionals(professionalsData) {
    return await Professional.bulkCreate(professionalsData, {
      validate: true,
      returning: true
    });
  }

  // 3. Atualizar um profissional existente pelo ID
  static async updateProfessional(id, updateData) {
    const professional = await Professional.findByPk(id);
    if (!professional) return null;
    return await professional.update(updateData);
  }

  // 4. Deletar um profissional do banco pelo ID
  static async deleteProfessional(id) {
    const professional = await Professional.findByPk(id);
    if (!professional) return false;
    await professional.destroy();
    return true;
  }
}

module.exports = ProfessionalService;