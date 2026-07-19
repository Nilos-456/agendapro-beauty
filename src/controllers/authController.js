const { User } = require('../../models');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

module.exports = {
  // 1. Cadastro de Usuário
  async register(req, res, next) {
    try {
      const { name, email, password, role } = req.body;

      if (!name || !email || !password) {
        return res.status(400).json({ success: false, error: 'Campos nome, email e senha são obrigatórios.' });
      }

      // Verificar se o e-mail já existe
      const userExists = await User.findOne({ where: { email } });
      if (userExists) {
        return res.status(400).json({ success: false, error: 'Este e-mail já está cadastrado.' });
      }

      // O hook do sequelize in User.js tratará o hashing da senha automaticamente
      const user = await User.create({
        name,
        email,
        password,
        role: role || 'cliente'
      });

      return res.status(201).json({
        success: true,
        message: 'Usuário registrado com sucesso!',
        data: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role
        }
      });
    } catch (error) {
      next(error);
    }
  },

  // 2. Login de Usuário e geração de token JWT
  async login(req, res, next) {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return res.status(400).json({ success: false, error: 'Email e senha são obrigatórios.' });
      }

      // Buscar usuário pelo email
      const user = await User.findOne({ where: { email } });
      if (!user) {
        return res.status(401).json({ success: false, error: 'Credenciais inválidas. E-mail não encontrado.' });
      }

      // Comparar senhas
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(401).json({ success: false, error: 'Credenciais inválidas. Senha incorreta.' });
      }

      // Gerar Token JWT
      const token = jwt.sign(
        {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role
        },
        process.env.JWT_SECRET || 'fallback_secret',
        { expiresIn: '1d' }
      );

      return res.status(200).json({
        success: true,
        message: 'Login realizado com sucesso!',
        token,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role
        }
      });
    } catch (error) {
      next(error);
    }
  }
};
