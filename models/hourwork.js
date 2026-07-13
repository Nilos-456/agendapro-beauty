'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class HourWork extends Model {
    static associate(models) {
      HourWork.belongsTo(models.Professional, {
        foreignKey: 'professional_id',
        as: 'professional'
      });
    }
  }
  HourWork.init({
    professional_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    dia_semana: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        min: 0,
        max: 6
      }
    },
    hora_inicio: {
      type: DataTypes.TIME,
      allowNull: false
    },
    hora_fim: {
      type: DataTypes.TIME,
      allowNull: false
    }
  }, {
    sequelize,
    modelName: 'HourWork',
    tableName: 'HourWorks'
  });
  return HourWork;
};
