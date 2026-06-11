-- Banco de dados: campo_minado
-- Criação das tabelas para a API Campo Minado

-- Tabela de usuários
CREATE TABLE IF NOT EXISTS usuarios (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    data_nascimento DATE NOT NULL,
    senha_hash VARCHAR(255) NOT NULL,
    saldo DECIMAL(10,2) DEFAULT 0.00,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Tabela de jogos (Relacionamento: Usuário 1 -> N Jogos)
CREATE TABLE IF NOT EXISTS jogos (
    id SERIAL PRIMARY KEY,
    usuario_id INTEGER NOT NULL,
    valor_aposta DECIMAL(10,2) NOT NULL,
    premio_atual DECIMAL(10,2) DEFAULT 0.00,
    status VARCHAR(20) DEFAULT 'EM_ANDAMENTO',
    tabuleiro JSONB,
    diamantes_encontrados INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT NOW(),
    finalizado_em TIMESTAMP,
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE
);

-- Índices para melhor performance
CREATE INDEX IF NOT EXISTS idx_jogos_usuario_id ON jogos(usuario_id);
CREATE INDEX IF NOT EXISTS idx_jogos_status ON jogos(status);
CREATE INDEX IF NOT EXISTS idx_usuarios_email ON usuarios(email);
