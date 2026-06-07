'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Professional extends Model {
    associate(models) {
      // Futuramente faremos o relacionamento com a agenda e os agendamentos aqui
    }
  }
  
  Professional.init({
    nome: {
      type: DataTypes.STRING,
      allowNull: false, // Campo obrigatório exigido na Sprint 2
      validate: {
        notEmpty: true
      }
    },
    especialidade: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true
      }
    },
    telefone: {
      type: DataTypes.STRING,
      allowNull: false
    },
    ativo: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true // Todo profissional começa ativo por padrão
    }
  }, {
    sequelize,
    modelName: 'Professional',
    tableName: 'Professionals' // Nome da tabela que será gerada no banco
  });
  
  return Professional;
};