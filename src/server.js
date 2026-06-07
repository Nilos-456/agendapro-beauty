// 1. Importa o Express que instalamos no passo anterior
const express = require('express');

// 2. Cria a nossa aplicação/servidor Express
const app = express();

// 3. Diz ao Express para aceitar e entender dados no formato JSON
app.use(express.json());

// 4. Cria a nossa primeira "Rota" de teste (uma rota do tipo GET)
// Quando alguém acessar http://localhost:3000/health, o servidor vai responder isso:
app.get('/health', (req, res) => {
    return res.status(200).json({ 
        status: "AgendaPro Beauty API rodando com sucesso!" 
    });
});

// 5. Define a porta onde o servidor vai ficar "escutando"
const PORT = 3000;

// 6. Liga o servidor de fato
app.listen(PORT, () => {
    console.log(`🚀 Servidor iniciado com sucesso em http://localhost:${PORT}`);
});