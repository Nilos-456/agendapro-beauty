require('dotenv').config();
const express = require('express');
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./swagger');
const professionalRoutes = require('./routes/professionalRoutes');
const serviceRoutes = require('./routes/serviceRoutes');
const appointmentRoutes = require('./routes/appointmentRoutes');
const errorHandler = require('./middleware/errorHandler');
const agendaRoutes = require('./routes/agendaRoutes');

const app = express();

// OBRIGATÓRIO: Para o Express entender as informações enviadas no cadastro
app.use(express.json());

// Swagger UI na rota /api-docs
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
  swaggerOptions: {
    persistAuthorization: true,
  },
}));

// Rota de teste simples
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK', message: 'Servidor rodando!' });
});

app.use('/professionals', professionalRoutes);
app.use('/services', serviceRoutes);
app.use('/appointments', appointmentRoutes);
app.use(agendaRoutes);

// Middleware de tratamento de erros (deve ser o último)
app.use(errorHandler);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
  console.log(`📚 Documentação Swagger: http://localhost:${PORT}/api-docs`);
});