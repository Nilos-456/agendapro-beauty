'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Professional extends Model {
    static associate(models) {
      Professional.hasMany(models.Appointment, {
        foreignKey: 'professional_id',
        as: 'appointments'
      });

      Professional.hasMany(models.HourWork, {
        foreignKey: 'professional_id',
        as: 'hourWorks'
      });

      Professional.hasMany(models.BlockedHour, {
        foreignKey: 'professional_id',
        as: 'blockedHours'
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
      defaultValue: true 
    }
  }, {
    sequelize,
    modelName: 'Professional',
    tableName: 'Professionals' 
  });
  
  return Professional;
};