const { hashPassword, comparePassword } = require('../modules/hash');
const { gerarToken } = require('../modules/jwt');
const userRepository = require('../repositories/userRepository');

const validarSenha = (senha) => {
  const regex = /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/;
  return regex.test(senha);
};

const registrar = async (nome, email, dataNascimento, senha, confirmacaoSenha) => {
  if (senha !== confirmacaoSenha) {
    throw new Error('Senhas não conferem');
  }
  
  if (!validarSenha(senha)) {
    throw new Error('Senha não atende aos requisitos (mínimo 8 caracteres, 1 maiúscula, 1 número, 1 caractere especial)');
  }

  const usuarioExistente = await userRepository.buscarUsuarioPorEmail(email);
  if (usuarioExistente) {
    throw new Error('E-mail já cadastrado');
  }

  const senhaHash = await hashPassword(senha);
  const novoUsuario = await userRepository.criarUsuario(nome, email, dataNascimento, senhaHash);
  
  return novoUsuario;
};

const login = async (email, senha) => {
  const usuario = await userRepository.buscarUsuarioPorEmail(email);
  if (!usuario) {
    throw new Error('Usuário não encontrado');
  }

  const senhaValida = await comparePassword(senha, usuario.senha_hash);
  if (!senhaValida) {
    throw new Error('Senha inválida');
  }

  const token = gerarToken(usuario);
  
  return { 
    usuario: {
      id: usuario.id,
      nome: usuario.nome, 
      email: usuario.email, 
      dataNascimento: usuario.data_nascimento,
      saldo: usuario.saldo
    }, 
    token 
  };
};

const resetPassword = async (id, novaSenha) => {
  const usuario = await userRepository.buscarUsuarioComSenha(id);
  if (!usuario) {
    throw new Error('Usuário não encontrado');
  }

  if (!validarSenha(novaSenha)) {
    throw new Error('Nova senha não atende aos requisitos');
  }

  const mesmaSenha = await comparePassword(novaSenha, usuario.senha_hash);
  if (mesmaSenha) {
    throw new Error('A nova senha não pode ser igual à atual');
  }

  const novaSenhaHash = await hashPassword(novaSenha);
  await userRepository.atualizarSenha(id, novaSenhaHash);
};

const cadastrarSaldo = async (id, saldo) => {
  if (saldo < 0) {
    throw new Error('Saldo não pode ser negativo');
  }
  
  saldo = Math.round(saldo * 100) / 100;
  
  const usuario = await userRepository.buscarUsuarioPorId(id);
  if (!usuario) {
    throw new Error('Usuário não encontrado');
  }

  await userRepository.atualizarSaldo(id, saldo);
};

const obterPerfil = async (id) => {
  const usuario = await userRepository.buscarUsuarioPorId(id);
  if (!usuario) {
    throw new Error('Usuário não encontrado');
  }
  return usuario;
};

const obterDashboard = async (id) => {
  const dashboard = await userRepository.obterDashboard(id);
  return {
    totalJogos: parseInt(dashboard.total_jogos || 0),
    vitorias: parseInt(dashboard.vitorias || 0),
    derrotas: parseInt(dashboard.derrotas || 0),
    valorGanho: parseFloat(dashboard.valor_ganho || 0),
    valorPerdido: parseFloat(dashboard.valor_perdido || 0)
  };
};

const deletarUsuario = async (id) => {
  const usuario = await userRepository.buscarUsuarioPorId(id);
  if (!usuario) {
    throw new Error('Usuário não encontrado');
  }
  await userRepository.deletarUsuario(id);
};

module.exports = { 
  registrar, 
  login, 
  resetPassword, 
  cadastrarSaldo, 
  obterPerfil, 
  obterDashboard, 
  deletarUsuario 
};
