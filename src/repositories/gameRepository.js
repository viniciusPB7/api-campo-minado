const pool = require('../config/db');

const buscarJogoEmAndamento = async (usuarioId) => {
  const result = await pool.query(
    'SELECT * FROM jogos WHERE usuario_id = $1 AND status = $2',
    [usuarioId, 'EM_ANDAMENTO']
  );
  return result.rows[0];
};

const iniciarJogo = async (usuarioId, valorAposta, tabuleiro) => {
  const result = await pool.query(
    'INSERT INTO jogos (usuario_id, valor_aposta, premio_atual, status, tabuleiro, diamantes_encontrados) VALUES ($1, $2, $3, $4, $5, $6) RETURNING id',
    [usuarioId, valorAposta, 0, 'EM_ANDAMENTO', JSON.stringify(tabuleiro), 0]
  );
  return result.rows[0].id;
};

const atualizarJogo = async (gameId, premioAtual, diamantesEncontrados, status, tabuleiro) => {
  await pool.query(
    `UPDATE jogos 
     SET premio_atual = $1, diamantes_encontrados = $2, status = $3, tabuleiro = $4, finalizado_em = CASE WHEN $3 != 'EM_ANDAMENTO' THEN NOW() ELSE NULL END
     WHERE id = $5`,
    [premioAtual, diamantesEncontrados, status, JSON.stringify(tabuleiro), gameId]
  );
};

const buscarJogoPorId = async (gameId) => {
  const result = await pool.query('SELECT * FROM jogos WHERE id = $1', [gameId]);
  return result.rows[0];
};

module.exports = { buscarJogoEmAndamento, iniciarJogo, atualizarJogo, buscarJogoPorId };
