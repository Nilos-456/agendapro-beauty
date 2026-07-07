require('dotenv').config();
const express = require('express');
const professionalRoutes = require('./routes/professionalRoutes');
const serviceRoutes = require('./routes/serviceRoutes');
const appointmentRoutes = require('./routes/appointmentRoutes');
const errorHandler = require('./middleware/errorHandler');

const app = express();

// OBRIGATÓRIO: Para o Express entender as informações enviadas no cadastro
app.use(express.json());

// Rota de teste simples
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK', message: 'Servidor rodando!' });
});

app.use('/professionals', professionalRoutes);
app.use('/services', serviceRoutes);
app.use('/appointments', appointmentRoutes);

// Middleware de tratamento de erros (deve ser o último)
app.use(errorHandler);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});