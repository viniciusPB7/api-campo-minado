const gameService = require('../services/gameService');

const startGame = async (req, res) => {
  try {
    const { idUser, valorAposta } = req.body;
    const gameId = await gameService.iniciarAposta(idUser, valorAposta);
    res.json({ gameId });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const reveal = async (req, res) => {
  try {
    const { gameId } = req.params;
    const { linha, coluna } = req.body;
    const resultado = await gameService.revelarPosicao(parseInt(gameId), linha, coluna);
    res.json(resultado);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const cashout = async (req, res) => {
  try {
    const { gameId } = req.params;
    const resultado = await gameService.cashout(parseInt(gameId));
    res.json(resultado);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

module.exports = { startGame, reveal, cashout };
