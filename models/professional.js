'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Professional extends Model {
    // 💡 IMPORTANTE: Precisa ser um método estático (static) para o loader index.js ler corretamente!
    static associate(models) {
      // Relacionamento com Agendamentos
      Professional.hasMany(models.Appointment, {
        foreignKey: 'professional_id',
        as: 'appointments'
      });

    //   // 🚀 RELACIONAMENTOS DAS SPRINTS 3 & 4:
    //   Professional.hasMany(models.HourWork, {
    //     foreignKey: 'professional_id',
    //     as: 'hourWorks'
    //   });

    //   Professional.hasMany(models.BlockedHour, {
    //     foreignKey: 'professional_id',
    //     as: 'blockedHours'
    //   });
    // }
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