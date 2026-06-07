const express = require('express');
const professionalRoutes = require('./routes/professionalRoutes');

const app = express();

// OBRIGATÓRIO: Para o Express entender as informações enviadas no cadastro
app.use(express.json());

// Rota de teste simples
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK', message: 'Servidor rodando!' });
});

// Vincula as rotas de profissionais ao servidor Express
app.use(professionalRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
