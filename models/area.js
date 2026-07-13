'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Area extends Model {
    static associate(models) {
      Area.hasMany(models.Service, {
        foreignKey: 'area_id',
        as: 'services'
      });
    }
  }
  Area.init({
    nome: DataTypes.STRING,
    descricao: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Area',
  });
  return Area;
};