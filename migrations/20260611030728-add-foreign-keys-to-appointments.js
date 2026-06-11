'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    // Adiciona a coluna professional_id
    await queryInterface.addColumn('Appointments', 'professional_id', {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: 'Professionals', // Nome da tabela de profissionais no banco
        key: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE'
    });

    // Adiciona a coluna service_id
    await queryInterface.addColumn('Appointments', 'service_id', {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: 'Services', // Nome da tabela de serviços no banco
        key: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE'
    });
  },

  async down(queryInterface, Sequelize) {
    // Caso queira desfazer, remove as colunas
    await queryInterface.removeColumn('Appointments', 'professional_id');
    await queryInterface.removeColumn('Appointments', 'service_id');
  }
};