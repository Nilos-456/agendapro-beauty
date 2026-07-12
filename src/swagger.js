const swaggerJsdoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'AgendaPro Beauty API',
      version: '1.0.0',
      description: 'API REST para gerenciamento de agendamentos em estabelecimentos de beleza',
      contact: {
        name: 'Natanael Lopes',
        email: 'natanael.levi.lopes@gmail.com',
      },
      license: {
        name: 'ISC',
      },
    },
    servers: [
      {
        url: 'http://localhost:3000',
        description: 'Development Server',
      },
      {
        url: 'https://api.agendapro-beauty.com',
        description: 'Production Server',
      },
    ],
    components: {
      schemas: {
        Professional: {
          type: 'object',
          required: ['nome', 'especialidade', 'telefone'],
          properties: {
            id: {
              type: 'integer',
              description: 'ID único do profissional',
            },
            nome: {
              type: 'string',
              description: 'Nome do profissional',
              example: 'Natanael Silva',
            },
            especialidade: {
              type: 'string',
              description: 'Especialidade (ex: Cabeleireiro, Manicure)',
              example: 'Cabeleireiro',
            },
            telefone: {
              type: 'string',
              description: 'Telefone de contato',
              example: '11999999999',
            },
            ativo: {
              type: 'boolean',
              description: 'Se o profissional está ativo',
              example: true,
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
            },
            updatedAt: {
              type: 'string',
              format: 'date-time',
            },
          },
        },
        Service: {
          type: 'object',
          required: ['nome_servico', 'preco', 'duracao'],
          properties: {
            id: {
              type: 'integer',
              description: 'ID único do serviço',
            },
            area_id: {
              type: 'integer',
              description: 'ID da área de serviço',
              example: 1,
            },
            nome_servico: {
              type: 'string',
              description: 'Nome do serviço',
              example: 'Corte de Cabelo Masculino',
            },
            preco: {
              type: 'number',
              format: 'decimal',
              description: 'Preço do serviço',
              example: 45.00,
            },
            duracao: {
              type: 'integer',
              description: 'Duração em minutos',
              example: 30,
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
            },
            updatedAt: {
              type: 'string',
              format: 'date-time',
            },
          },
        },
        Appointment: {
          type: 'object',
          required: ['professional_id', 'service_id', 'data_hora'],
          properties: {
            id: {
              type: 'integer',
              description: 'ID único do agendamento',
            },
            professional_id: {
              type: 'integer',
              description: 'ID do profissional',
              example: 1,
            },
            service_id: {
              type: 'integer',
              description: 'ID do serviço',
              example: 1,
            },
            data_hora: {
              type: 'string',
              format: 'date-time',
              description: 'Data e hora do agendamento',
              example: '2026-07-07T09:00:00',
            },
            status: {
              type: 'string',
              description: 'Status do agendamento',
              enum: ['agendado', 'confirmado', 'concluído', 'cancelado'],
              example: 'agendado',
            },
            observacoes: {
              type: 'string',
              description: 'Observações adicionais',
              example: 'Cliente preferência: corte simples',
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
            },
            updatedAt: {
              type: 'string',
              format: 'date-time',
            },
          },
        },
        Error: {
          type: 'object',
          properties: {
            success: {
              type: 'boolean',
              example: false,
            },
            error: {
              type: 'string',
              example: 'Recurso não encontrado',
            },
            status: {
              type: 'integer',
              example: 404,
            },
            timestamp: {
              type: 'string',
              format: 'date-time',
            },
          },
        },
      },
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
  },
  apis: ['./src/routes/*.js'],
};

const swaggerSpec = swaggerJsdoc(options);

module.exports = swaggerSpec;
