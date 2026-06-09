'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Service extends Model {
    static associate(models) {
      // Por enquanto não temos associações, deixamos vazio
    }
  }
  
  Service.init({
    nome_servico: {
      type: DataTypes.STRING,
      allowNull: false
    },
    preco: {
      type: DataTypes.FLOAT,
      allowNull: false
    },
    duracao: {
      type: DataTypes.INTEGER, // Tempo em minutos
      allowNull: false
    }
  }, {
    sequelize,
    modelName: 'Service',
  });
  
  return Service;
};