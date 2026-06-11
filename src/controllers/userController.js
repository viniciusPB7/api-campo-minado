const userService = require('../services/userService');

const getPerfil = async (req, res) => {
  try {
    const { id } = req.params;
    const usuario = await userService.obterPerfil(parseInt(id));
    res.json(usuario);
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
};

const getDashboard = async (req, res) => {
  try {
    const { id } = req.params;
    const dashboard = await userService.obterDashboard(parseInt(id));
    res.json(dashboard);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const putSaldo = async (req, res) => {
  try {
    const { id } = req.params;
    const { saldo } = req.body;
    await userService.cadastrarSaldo(parseInt(id), saldo);
    res.status(204).send();
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    await userService.deletarUsuario(parseInt(id));
    res.status(204).send();
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

module.exports = { getPerfil, getDashboard, putSaldo, deleteUser };
