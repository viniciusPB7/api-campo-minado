const pool = require('../config/db');

const criarUsuario = async (nome, email, dataNascimento, senhaHash) => {
  const result = await pool.query(
    'INSERT INTO usuarios (nome, email, data_nascimento, senha_hash) VALUES ($1, $2, $3, $4) RETURNING id, nome, email, data_nascimento, saldo',
    [nome, email, dataNascimento, senhaHash]
  );
  return result.rows[0];
};

const buscarUsuarioPorEmail = async (email) => {
  const result = await pool.query('SELECT * FROM usuarios WHERE email = $1', [email]);
  return result.rows[0];
};

const buscarUsuarioPorId = async (id) => {
  const result = await pool.query('SELECT id, nome, email, data_nascimento, saldo FROM usuarios WHERE id = $1', [id]);
  return result.rows[0];
};

const buscarUsuarioComSenha = async (id) => {
  const result = await pool.query('SELECT * FROM usuarios WHERE id = $1', [id]);
  return result.rows[0];
};

const atualizarSaldo = async (id, novoSaldo) => {
  await pool.query('UPDATE usuarios SET saldo = $1 WHERE id = $2', [novoSaldo, id]);
};

const atualizarSenha = async (id, novaSenhaHash) => {
  await pool.query('UPDATE usuarios SET senha_hash = $1 WHERE id = $2', [novaSenhaHash, id]);
};

const deletarUsuario = async (id) => {
  await pool.query('DELETE FROM usuarios WHERE id = $1', [id]);
};

const obterDashboard = async (id) => {
  const result = await pool.query(
    `SELECT 
      COUNT(*) as total_jogos,
      SUM(CASE WHEN status = 'VITORIA' THEN 1 ELSE 0 END) as vitorias,
      SUM(CASE WHEN status = 'DERROTA' THEN 1 ELSE 0 END) as derrotas,
      SUM(CASE WHEN status = 'VITORIA' THEN premio_atual ELSE 0 END) as valor_ganho,
      SUM(CASE WHEN status = 'DERROTA' THEN valor_aposta ELSE 0 END) as valor_perdido
    FROM jogos WHERE usuario_id = $1`,
    [id]
  );
  return result.rows[0];
};

module.exports = { 
  criarUsuario, 
  buscarUsuarioPorEmail, 
  buscarUsuarioPorId, 
  buscarUsuarioComSenha,
  atualizarSaldo, 
  atualizarSenha,
  deletarUsuario, 
  obterDashboard 
};
