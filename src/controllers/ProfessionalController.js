const ProfessionalService = require('../services/professionalService');

module.exports = {
  // 1. Listar profissionais (GET)
  async index(req, res) {
    try {
      const professionals = await ProfessionalService.getAllProfessionals();
      return res.status(200).json(professionals);
    } catch (error) {
      console.error('Erro no index de profissionais:', error);
      return res.status(500).json({ error: 'Erro ao buscar profissionais.', details: error.message });
    }
  },

  // 2. Cadastrar em lote (POST Bulk)
  async store(req, res) {
    try {
      const professionalsList = req.body;

      if (!Array.isArray(professionalsList) || professionalsList.length === 0) {
        return res.status(400).json({ error: 'O corpo da requisição deve ser uma lista [] de profissionais.' });
      }

      // Garantimos que cada objeto do array tenha exatamente o formato esperado pelo Model
      const cleanData = professionalsList.map(p => ({
        nome: p.nome,
        especialidade: p.especialidade,
        telefone: p.telefone,
        ativo: p.ativo !== undefined ? p.ativo : true
      }));

      // Passa os dados limpos para o Service
      await ProfessionalService.createBulkProfessionals(cleanData);
      
      return res.status(201).json({
        message: 'Lista de profissionais salva com sucesso!',
        count: cleanData.length
      });
    } catch (error) {
      console.error('Erro no storeBulk:', error);
      return res.status(500).json({ error: 'Erro ao salvar a lista de profissionais no banco de dados.', details: error.message });
    }
  },

  // 3. Editar profissional (PUT)
  async update(req, res) {
    try {
      const { id } = req.params;
      const updatedProfessional = await ProfessionalService.updateProfessional(id, req.body);
      
      if (!updatedProfessional) {
        return res.status(404).json({ error: 'Profissional não encontrado.' });
      }

      return res.status(200).json({
        message: 'Profissional atualizado com sucesso!',
        data: updatedProfessional
      });
    } catch (error) {
      console.error('Erro no update de profissionais:', error);
      return res.status(400).json({ error: 'Erro ao atualizar o profissional.', details: error.message });
    }
  },

  // 4. Deletar profissional (DELETE)
  async delete(req, res) {
    try {
      const { id } = req.params;
      const deleted = await ProfessionalService.deleteProfessional(id);

      if (!deleted) {
        return res.status(404).json({ error: 'Profissional não encontrado.' });
      }

      return res.status(200).json({ message: 'Profissional excluído com sucesso!' });
    } catch (error) {
      console.error('Erro no delete de profissionais:', error);
      return res.status(500).json({ error: 'Erro ao excluir o profissional.', details: error.message });
    }
  }
};
