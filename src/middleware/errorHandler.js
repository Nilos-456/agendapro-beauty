// Middleware para tratamento centralizado de erros

module.exports = (err, req, res, next) => {
  console.error('Erro:', err.message);

  const status = err.status || 500;
  const message = err.message || 'Erro interno do servidor';

  res.status(status).json({
    error: message,
    status,
    timestamp: new Date().toISOString()
  });
};
