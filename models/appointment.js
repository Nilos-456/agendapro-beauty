'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Appointment extends Model {
    static associate(models) {
      // Um agendamento pertence a um profissional
      this.belongsTo(models.Professional, { 
        foreignKey: 'professional_id', 
        as: 'professional' 
      });
      // Um agendamento pertence a um serviço
      this.belongsTo(models.Service, { 
        foreignKey: 'service_id', 
        as: 'service' 
      });
    }
  }
  
Appointment.init({
    data_hora: { type: DataTypes.DATE, allowNull: false },
    status: { type: DataTypes.STRING, allowNull: false, defaultValue: 'agendado' },
    observacoes: DataTypes.TEXT,
    professional_id: { 
      type: DataTypes.INTEGER, 
      allowNull: false,
      field: 'professional_id' // Garante que olha para a coluna com underline
    },
    service_id: { 
      type: DataTypes.INTEGER, 
      allowNull: false,
      field: 'service_id' // Garante que olha para a coluna com underline
    }
  }, {
    sequelize,
    modelName: 'Appointment',
    tableName: 'Appointments',
  });
  return Appointment;
};
