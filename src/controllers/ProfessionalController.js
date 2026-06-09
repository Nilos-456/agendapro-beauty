const { Professional } = require('../../models');

module.exports = {
  // 1. Rota de Listagem
  async index(req, res) {
    try {
      const professionals = await Professional.findAll();
      return res.status(200).json(professionals);
    } catch (error) {
      console.error('Erro no index:', error);
      return res.status(500).json({ error: 'Erro ao buscar profissionais.' });
    }
  },

  // 2. Rota de Cadastro em Massa
  async store(req, res) {
    try {
      const professionalsList = req.body;

      if (!Array.isArray(professionalsList) || professionalsList.length === 0) {
        return res.status(400).json({ error: 'O corpo da requisição deve ser uma lista [] de profissionais.' });
      }

      const formattedProfessionals = professionalsList.map(p => ({
        nome: p.nome,
        especialidade: p.specialty,
        telefone: p.telefone,
        ativo: p.ativo !== undefined ? p.ativo : true
      }));

      const createdProfessionals = await Professional.bulkCreate(formattedProfessionals);
      return res.status(201).json(createdProfessionals);
    } catch (error) {
      console.error('Erro no storeBulk:', error);
      return res.status(500).json({ error: 'Erro ao salvar a lista de profissionais no banco de dados.' });
    }
  },

  // 3. Rota de Atualização (PUT)
  async update(req, res) {
    try {
      const { id } = req.params; // Pega o ID da URL (ex: /professionals/1)
      const { nome, specialty, telefone, ativo } = req.body;

      // Busca o profissional no banco pelo ID
      const professional = await Professional.findByPk(id);

      if (!professional) {
        return res.status(404).json({ error: 'Profissional não encontrado.' });
      }

      // Atualiza os dados no banco (mapeando specialty para especialidade)
      await professional.update({
        nome: nome || professional.nome,
        especialidade: specialty || professional.especialidade,
        telefone: telefone || professional.telefone,
        ativo: ativo !== undefined ? ativo : professional.ativo
      });

      return res.status(200).json(professional);
    } catch (error) {
      console.error('Erro no update:', error);
      return res.status(500).json({ error: 'Erro ao atualizar profissional.' });
    }
  },

  // 4. Rota de Exclusão (DELETE)
  async delete(req, res) {
    try {
      const { id } = req.params;

      const professional = await Professional.findByPk(id);

      if (!professional) {
        return res.status(404).json({ error: 'Profissional não encontrado.' });
      }

      // Deleta o registro do PostgreSQL
      await professional.destroy();

      return res.status(200).json({ message: 'Profissional deletado com sucesso!' });
    } catch (error) {
      console.error('Erro no delete:', error);
      return res.status(500).json({ error: 'Erro ao deletar profissional.' });
    }
  }
};