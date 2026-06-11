const gameRepository = require('../repositories/gameRepository');
const userRepository = require('../repositories/userRepository');

const criarTabuleiro = () => {
  const total = 25;
  const bombas = 5;
  const posicoes = Array(total).fill('DIAMANTE');
  
  for (let i = 0; i < bombas; i++) {
    posicoes[i] = 'BOMBA';
  }
  
  for (let i = posicoes.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [posicoes[i], posicoes[j]] = [posicoes[j], posicoes[i]];
  }
  
  const tabuleiro = [];
  for (let i = 0; i < 5; i++) {
    tabuleiro.push(posicoes.slice(i * 5, i * 5 + 5));
  }
  
  return tabuleiro;
};

const calcularPremio = (valorAposta, diamantesEncontrados) => {
  const premio = valorAposta * (1 + (diamantesEncontrados * 0.33));
  return Math.round(premio * 100) / 100;
};

const iniciarAposta = async (usuarioId, valorAposta) => {
  const emAndamento = await gameRepository.buscarJogoEmAndamento(usuarioId);
  if (emAndamento) {
    throw new Error('Usuário possui uma partida em andamento');
  }

  const usuario = await userRepository.buscarUsuarioPorId(usuarioId);
  if (!usuario) {
    throw new Error('Usuário não encontrado');
  }
  
  if (usuario.saldo < valorAposta) {
    throw new Error('Saldo insuficiente');
  }

  const novoSaldo = usuario.saldo - valorAposta;
  await userRepository.atualizarSaldo(usuarioId, novoSaldo);

  const tabuleiro = criarTabuleiro();
  const gameId = await gameRepository.iniciarJogo(usuarioId, valorAposta, tabuleiro);

  return gameId;
};

const revelarPosicao = async (gameId, linha, coluna) => {
  if (linha < 0 || linha > 4 || coluna < 0 || coluna > 4) {
    throw new Error('Posição inválida');
  }

  const jogo = await gameRepository.buscarJogoPorId(gameId);
  if (!jogo) {
    throw new Error('Jogo não encontrado');
  }
  
  if (jogo.status !== 'EM_ANDAMENTO') {
    throw new Error('Este jogo já foi finalizado');
  }

  let tabuleiro = jogo.tabuleiro;
  const posicao = tabuleiro[linha][coluna];

  if (posicao === 'REVELADO') {
    throw new Error('Posição já foi revelada');
  }

  if (posicao === 'BOMBA') {
    await gameRepository.atualizarJogo(gameId, jogo.premio_atual, jogo.diamantes_encontrados, 'DERROTA', tabuleiro);
    return { resultado: 'BOMBA', status: 'PERDIDO' };
  }

  tabuleiro[linha][coluna] = 'REVELADO';
  const novosDiamantes = jogo.diamantes_encontrados + 1;
  const novoPremio = calcularPremio(jogo.valor_aposta, novosDiamantes);

  await gameRepository.atualizarJogo(gameId, novoPremio, novosDiamantes, 'EM_ANDAMENTO', tabuleiro);

  return {
    resultado: 'DIAMANTE',
    diamantesEncontrados: novosDiamantes,
    premioAtual: novoPremio
  };
};

const cashout = async (gameId) => {
  const jogo = await gameRepository.buscarJogoPorId(gameId);
  if (!jogo) {
    throw new Error('Jogo não encontrado');
  }
  
  if (jogo.status !== 'EM_ANDAMENTO') {
    throw new Error('Este jogo já foi finalizado');
  }

  const usuario = await userRepository.buscarUsuarioPorId(jogo.usuario_id);
  const premio = parseFloat(jogo.premio_atual) || 0;
  const novoSaldo = parseFloat(usuario.saldo) + premio;
  
  await userRepository.atualizarSaldo(jogo.usuario_id, novoSaldo);
  await gameRepository.atualizarJogo(gameId, premio, jogo.diamantes_encontrados, 'VITORIA', jogo.tabuleiro);

  return { 
    mensagem: 'Prêmio sacado com sucesso', 
    valor: premio
  };
};

module.exports = { iniciarAposta, revelarPosicao, cashout };
