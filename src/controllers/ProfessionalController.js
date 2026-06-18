const { Professional } = require('../../models'); // Adicionados mais dois pontos (..) para sair de src e ir para a raiz! // Importa o model direto do banco

module.exports = {
  // 1. Listar todos os profissionais
  async index(req, res) {
    try {
      const professionals = await Professional.findAll();
      return res.status(200).json(professionals);
    } catch (error) {
      return res.status(500).json({ error: 'Erro ao listar profissionais.', details: error.message });
    }
  },

  // 2. Criar um novo profissional
  async store(req, res) {
    try {
      const { nome, especialidade, contato } = req.body;

      // Validação simples dos campos obrigatórios
      if (!nome || !especialidade) {
        return res.status(400).json({ error: 'Nome e especialidade são obrigatórios.' });
      }

      const newProfessional = await Professional.create({ nome, especialidade, contato });
      return res.status(201).json(newProfessional);
    } catch (error) {
      return res.status(500).json({ error: 'Erro ao criar profissional.', details: error.message });
    }
  },

  // 3. Atualizar dados de um profissional
  async update(req, res) {
    try {
      const { id } = req.params;
      const { nome, especialidade, contato } = req.body;

      const professional = await Professional.findByPk(id);
      if (!professional) {
        return res.status(404).json({ error: 'Profissional não encontrado.' });
      }

      await professional.update({ nome, especialidade, contato });
      return res.status(200).json(professional);
    } catch (error) {
      return res.status(500).json({ error: 'Erro ao atualizar profissional.', details: error.message });
    }
  },

  // 4. Deletar um profissional
  async delete(req, res) {
    try {
      const { id } = req.params;

      const professional = await Professional.findByPk(id);
      if (!professional) {
        return res.status(404).json({ error: 'Profissional não encontrado.' });
      }

      await professional.destroy();
      return res.status(200).json({ message: 'Profissional deletado com sucesso.' });
    } catch (error) {
      return res.status(500).json({ error: 'Erro ao deletar profissional.', details: error.message });
    }
  }
};