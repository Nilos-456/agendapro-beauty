'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    // Inserir profissionais de exemplo
    await queryInterface.bulkInsert('Professionals', [
      {
        nome: 'Maria Silva',
        especialidade: 'Manicure',
        telefone: '11999999999',
        ativo: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        nome: 'Ana Santos',
        especialidade: 'Pedicure',
        telefone: '11988888888',
        ativo: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        nome: 'Carlos Oliveira',
        especialidade: 'Barbeiro',
        telefone: '11977777777',
        ativo: true,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ], {});
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Professionals', null, {});
  }
};
