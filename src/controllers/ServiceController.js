// Importa o model Service direto da sua pasta real mapeada pelo Sequelize
const { Service } = require('../../models'); 

module.exports = {
  // 1. Listar todos os serviços (Aceita filtro opcional ex: /services?area_id=2)
  async index(req, res) {
    try {
      // Captura o area_id que vem opcionalmente na URL
      const { area_id } = req.query; 

      let filtro = {};
      // Se informarem uma área na URL, aplica o filtro na busca do Sequelize
      if (area_id) {
        filtro.area_id = area_id;
      }

      // Busca direta no banco de dados usando o seu Model real
      const services = await Service.findAll({ where: filtro });
      
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

      // Cria todos os registros da lista de uma vez diretamente no banco usando o ORM
      const criados = await Service.bulkCreate(servicesList);

      return res.status(201).json({
        message: 'Lista de serviços salva com sucesso!',
        count: criados.length
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
      const { area_id, nome_servico, preco, duracao } = req.body;

      // Busca o serviço pelo ID antes de tentar atualizar
      const service = await Service.findByPk(id);
      
      if (!service) {
        return res.status(404).json({ error: 'Serviço não encontrado.' });
      }

      // Atualiza os campos enviados na requisição
      await service.update({ area_id, nome_servico, preco, duracao });

      return res.status(200).json({
        message: 'Serviço updated com sucesso!',
        data: service
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
      
      // Busca o serviço para checar se ele existe antes de deletar
      const service = await Service.findByPk(id);

      if (!service) {
        return res.status(404).json({ error: 'Serviço não encontrado.' });
      }

      // Deleta o registro do banco de dados
      await service.destroy();

      return res.status(200).json({ message: 'Serviço excluído com sucesso!' });
    } catch (error) {
      console.error('Erro no delete de serviços:', error);
      return res.status(500).json({ error: 'Erro ao excluir o serviço.', details: error.message });
    }
  }
};

  