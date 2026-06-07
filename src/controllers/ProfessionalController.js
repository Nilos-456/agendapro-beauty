const { Professional } = require('../../models');

module.exports = {
  // Rota de Listagem (Mantém igual)
  async index(req, res) {
    try {
      const professionals = await Professional.findAll();
      return res.status(200).json(professionals);
    } catch (error) {
      console.error('Erro no index:', error);
      return res.status(500).json({ error: 'Erro ao buscar profissionais.' });
    }
  },

  // Rota de Cadastro em Massa (Modificada para aceitar listas!)
  async store(req, res) {
    try {
      const professionalsList = req.body;

      // Se não for uma lista ou estiver vazia, avisa o usuário
      if (!Array.isArray(professionalsList) || professionalsList.length === 0) {
        return res.status(400).json({ error: 'O corpo da requisição deve ser uma lista [] de profissionais.' });
      }

      // Mapeia os campos do JSON para as colunas corretas do banco de dados
      const formattedProfessionals = professionalsList.map(p => ({
        nome: p.nome,
        especialidade: p.specialty,
        telefone: p.telefone,
        ativo: p.ativo !== undefined ? p.ativo : true
      }));

      // Salva todos de uma vez só no PostgreSQL
      const createdProfessionals = await Professional.bulkCreate(formattedProfessionals);

      return res.status(201).json(createdProfessionals);
    } catch (error) {
      console.error('Erro no storeBulk:', error);
      return res.status(500).json({ error: 'Erro ao salvar a lista de profissionais no banco de dados.' });
    }
  }
};
