// Importamos os modelos que estão mapeados na pasta models
const { Professional } = require('../../models');
module.exports = {
  // 1. Rota de Listagem (GET /professionals)
  // Retorna todos os profissionais cadastrados no banco de dados
  async index(req, res) {
    try {
      const professionals = await Professional.findAll();
      return res.status(200).json(professionals);
    } catch (error) {
      console.error('Erro no index:', error);
      return res.status(500).json({ error: 'Erro ao buscar profissionais no banco de dados.' });
    }
  },

  // 2. Rota de Cadastro (POST /professionals)
  // Recebe os dados do corpo da requisição e cria um novo registro
  async store(req, res) {
    try {
      const { nome, specialty, telefone, ativo } = req.body;

      // Validação básica de campos obrigatórios exigida na Sprint 2
      if (!nome || !specialty) {
        return res.status(400).json({ error: 'Nome e Especialidade são campos obrigatórios.' });
      }

      // Criando o registro no banco usando o Sequelize
      const professional = await Professional.create({
        nome,
        especialidade: specialty, // Mapeando o termo do JSON para a coluna certa do banco
        telefone,
        ativo: ativo !== undefined ? ativo : true // Se não enviar nada, define como ativo por padrão
      });

      // Retorna o profissional criado com o status 201 (Created)
      return res.status(201).json(professional);
    } catch (error) {
      console.error('Erro no store:', error);
      return res.status(500).json({ error: 'Erro ao salvar o profissional no banco de dados.' });
    }
  }
};