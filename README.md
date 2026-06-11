# 🎮 API Campo Minado

API REST para plataforma de apostas baseada no jogo Campo Minado.

## 🚀 Tecnologias Utilizadas

- **Node.js** (v24.15.0)
- **Express.js** - Framework web
- **PostgreSQL** - Banco de dados relacional
- **bcryptjs** - Hash de senhas
- **jsonwebtoken** - Autenticação JWT
- **dotenv** - Gerenciamento de variáveis de ambiente
- **nodemon** - Desenvolvimento com auto-reload

## 📋 Funcionalidades Implementadas

### 👤 Usuários
- [x] Cadastro com validação de senha forte
- [x] Login autenticado
- [x] Reset de senha
- [x] Cadastro de saldo
- [x] Exclusão de conta com cascata

### 🎮 Jogo
- [x] Iniciar aposta (valida saldo e jogo em andamento)
- [x] Revelar posições do tabuleiro 5x5
- [x] Sistema de premiação progressiva
- [x] Finalizar jogo e creditar prêmio
- [x] Dashboard com estatísticas do jogador

## ⚙️ Como Executar o Projeto

### 1. Clone o repositório
```bash
git clone https://github.com/viniciusPB7/api-campo-minado.git
cd api-campo-minado