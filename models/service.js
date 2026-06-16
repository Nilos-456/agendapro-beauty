'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Service extends Model {
    static associate(models) {
      // Configura a associação: Um Serviço pertence a uma Área (Area)
      // Certifique-se de que o seu model de área chama 'Area' ou ajuste o nome abaixo
      this.belongsTo(models.Area, { 
        foreignKey: 'area_id', 
        as: 'area' 
      });
    }
  }
  
  Service.init({
    // Adicionando a chave estrangeira da área conforme o diagrama ER do IFRS
    area_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Areas', // Nome da tabela de áreas no banco de dados
        key: 'id'
      }
    },
    nome_servico: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: { msg: "O nome do serviço não pode ser vazio." }
      }
    },
    preco: {
      type: DataTypes.FLOAT, // Seu padrão atual (pode ser FLOAT ou DECIMAL)
      allowNull: false,
      validate: {
        isFloat: { msg: "O preço precisa ser um número válido." },
        min: { args: [0], msg: "O preço não pode ser negativo." }
      }
    },
    duracao: {
      type: DataTypes.INTEGER, // Tempo em minutos
      allowNull: false,
      validate: {
        isInt: { msg: "A duração precisa ser um número inteiro de minutos." },
        min: { args: [1], msg: "A duração deve ser de pelo menos 1 minuto." }
      }
    }
  }, {
    sequelize,
    modelName: 'Service',
    tableName: 'services', // Garante que o Sequelize use o nome correto da tabela
  });
  
  return Service;
};
