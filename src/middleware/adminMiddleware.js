module.exports = (req, res, next) => {
  if (!req.user || (req.user.role !== 'admin' && req.user.role !== 'administrador')) {
    return res.status(403).json({
      success: false,
      error: 'Acesso negado. Apenas administradores podem realizar esta operação.'
    });
  }
  next();
};
