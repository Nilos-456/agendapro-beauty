'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Service extends Model {
    static associate(models) {
      // Define a associação inversa: Um Serviço pertence a muitos Agendamentos
      Service.hasMany(models.Appointment, {
        foreignKey: 'service_id',
        as: 'appointments'
      });
    }
  }

  Service.init({
    area_id: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    nome_servico: {
      type: DataTypes.STRING,
      allowNull: false
    },
    preco: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false
    },
    duracao: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  }, {
    sequelize,
    modelName: 'Service',
    tableName: 'Services'
  });

  return Service;
};