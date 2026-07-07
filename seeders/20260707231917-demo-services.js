'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    // Inserir serviços de exemplo
    await queryInterface.bulkInsert('Services', [
      {
        area_id: 1,
        nome_servico: 'Manicure Simples',
        preco: '30.00',
        duracao: 30,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        area_id: 1,
        nome_servico: 'Manicure Gel',
        preco: '60.00',
        duracao: 45,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        area_id: 2,
        nome_servico: 'Pedicure Completa',
        preco: '50.00',
        duracao: 45,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        area_id: 3,
        nome_servico: 'Corte Masculino',
        preco: '35.00',
        duracao: 30,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ], {});
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Services', null, {});
  }
};
