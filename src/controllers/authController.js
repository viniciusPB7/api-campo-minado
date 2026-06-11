const userService = require('../services/userService');

const register = async (req, res) => {
  try {
    const { nome, email, dataNascimento, senha, confirmacaoSenha } = req.body;
    const usuario = await userService.registrar(nome, email, dataNascimento, senha, confirmacaoSenha);
    res.status(201).json(usuario);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const login = async (req, res) => {
  try {
    const { email, senha } = req.body;
    const resultado = await userService.login(email, senha);
    res.json(resultado.usuario);
  } catch (error) {
    res.status(401).json({ error: error.message });
  }
};

const resetPassword = async (req, res) => {
  try {
    const { id, novaSenha } = req.body;
    await userService.resetPassword(parseInt(id), novaSenha);
    res.status(204).send();
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

module.exports = { register, login, resetPassword };
