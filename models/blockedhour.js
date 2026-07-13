'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class BlockedHour extends Model {
    static associate(models) {
      BlockedHour.belongsTo(models.Professional, {
        foreignKey: 'professional_id',
        as: 'professional'
      });
    }
  }
  BlockedHour.init({
    professional_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    inicio: {
      type: DataTypes.DATE,
      allowNull: false
    },
    fim: {
      type: DataTypes.DATE,
      allowNull: false
    },
    motivo: {
      type: DataTypes.STRING,
      allowNull: true
    }
  }, {
    sequelize,
    modelName: 'BlockedHour',
    tableName: 'BlockedHours'
  });
  return BlockedHour;
};
