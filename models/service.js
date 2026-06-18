'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Service extends Model {
    static associate(models) {
      // COMENTADO TEMPORARIAMENTE ATÉ VOCÊ CRIAR O MODEL DA ÁREA
      // this.belongsTo(models.Area, { 
      //   foreignKey: 'area_id', 
      //   as: 'area' 
      // });
    }
  }
  
  Service.init({
    // Mantemos o campo area_id normal para o banco salvar o número da área!
    area_id: {
      type: DataTypes.INTEGER,
      allowNull: false
      // Se der erro de banco reclamando que a tabela Areas não existe, 
      // comente também o bloco 'references' abaixo:
      // references: {
      //   model: 'Areas', 
      //   key: 'id'
      // }
    },
    nome_servico: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: { msg: "O nome do serviço não pode ser vazio." }
      }
    },
    preco: {
      type: DataTypes.FLOAT, 
      allowNull: false,
      validate: {
        isFloat: { msg: "O preço precisa ser um número válido." },
        min: { args: [0], msg: "O preço não pode ser negativo." }
      }
    },
    duracao: {
      type: DataTypes.INTEGER, 
      allowNull: false,
      validate: {
        isInt: { msg: "A duração precisa ser um número inteiro de minutos." },
        min: { args: [1], msg: "A duração deve ser de pelo menos 1 minuto." }
      }
    }
  }, {
    sequelize,
    modelName: 'Service',
    tableName: 'Services', // IMPORTANTE: Deixe com "S" maiúsculo igual está na sua migration!
  });
  
  return Service;
};