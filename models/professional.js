'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Professional extends Model {
    associate(models) {
      // Um profissional tem muitos agendamentos
      this.hasMany(models.Appointment, {
        foreignKey: 'professional_id',
        as: 'appointments'
      });
    }
  }
  
  Professional.init({
    nome: {
      type: DataTypes.STRING,
      allowNull: false, 
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