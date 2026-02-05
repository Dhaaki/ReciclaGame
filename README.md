# 🌱 ReciclaGame - Jogo Educativo de Reciclagem Sustentável

Protótipo funcional de um jogo educativo gamificado voltado à conscientização sobre reciclagem sustentável, destinado a alunos do ensino fundamental (5º ao 7º ano).

[![GitHub](https://img.shields.io/badge/GitHub-Repository-blue)](https://github.com/Dhaaki/ReciclaGame)

## 🏗️ Arquitetura

- **Front-end**: React.js com JavaScript
- **Back-end**: Node.js com Express.js (API REST)
- **Banco de Dados**: PostgreSQL

## 📋 Pré-requisitos

- Node.js (versão 16 ou superior)
- PostgreSQL (versão 12 ou superior)
- npm ou yarn

## 🚀 Instalação e Configuração

### 1. Configurar o Banco de Dados

```bash
# Criar banco de dados
createdb reciclagem_game

# Ou usando psql
psql -U postgres
CREATE DATABASE reciclagem_game;
```

### 2. Configurar o Back-end

```bash
cd backend
npm install
```

Criar arquivo `.env` na pasta `backend`:

```env
DB_HOST=localhost
DB_PORT=5432
DB_NAME=reciclagem_game
DB_USER=postgres
DB_PASSWORD=sua_senha
PORT=3001
JWT_SECRET=seu_secret_jwt_aqui
```

### 3. Executar Migrações do Banco

```bash
cd backend
npm run migrate
```

### 4. Configurar o Front-end

```bash
cd frontend
npm install
```

Criar arquivo `.env` na pasta `frontend`:

```env
REACT_APP_API_URL=http://localhost:3001
```

## 🎮 Executando o Projeto

### Back-end

```bash
cd backend
npm start
```

O servidor estará rodando em `http://localhost:3001`

### Front-end

```bash
cd frontend
npm start
```

A aplicação estará rodando em `http://localhost:3000`

## 📚 Estrutura do Projeto

```
projeto-faucl/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   ├── controllers/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── middleware/
│   │   └── utils/
│   ├── migrations/
│   └── server.js
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── utils/
│   │   └── App.js
│   └── public/
└── README.md
```

## 🎯 Funcionalidades

- ✅ Cadastro e login de usuários (alunos e professores)
- ✅ Registro de materiais reciclados com upload de imagem
- ✅ Sistema de pontuação baseado no tipo de material
- ✅ Quizzes educativos com pontuação extra
- ✅ Ranking geral e por turma
- ✅ Sistema de níveis (iniciante, consciente, sustentável, agente verde)
- ✅ Histórico de reciclagem
- ✅ **NOVO:** Sistema de análises e métricas com gráficos interativos
- ✅ **NOVO:** Métricas por turma, idade, sexo e tipo de material
- ✅ **NOVO:** Estatísticas detalhadas para professores e administradores

## 🔐 Autenticação

O sistema utiliza autenticação simples baseada em JWT. Após o login, o token é armazenado no localStorage e enviado nas requisições subsequentes.

## 📊 Regras de Pontuação

- **Papel**: 10 pontos por unidade
- **Plástico**: 15 pontos por unidade
- **Metal**: 20 pontos por unidade
- **Vidro**: 25 pontos por unidade
- **Quiz correto**: 50 pontos extras

## 🏆 Níveis

- **Iniciante**: 0-100 pontos
- **Consciente**: 101-300 pontos
- **Sustentável**: 301-600 pontos
- **Agente Verde**: 601+ pontos

## 📝 Endpoints da API

### Usuários
- `POST /api/users/register` - Cadastro de usuário
- `POST /api/users/login` - Login
- `GET /api/users/:id` - Dados do usuário

### Reciclagem
- `POST /api/recycling-records` - Registrar reciclagem
- `GET /api/recycling-records/user/:userId` - Histórico do usuário

### Quizzes
- `GET /api/quizzes` - Listar quizzes
- `POST /api/quizzes/answer` - Responder quiz

### Ranking e Pontuação
- `GET /api/ranking` - Ranking geral
- `GET /api/scores/:userId` - Pontuação do usuário

### Analytics (NOVO)
- `GET /api/analytics/geral` - Estatísticas gerais
- `GET /api/analytics/turma` - Métricas por turma
- `GET /api/analytics/idade` - Métricas por idade
- `GET /api/analytics/sexo` - Métricas por sexo
- `GET /api/analytics/material` - Métricas por material
- `GET /api/analytics/top-turmas` - Top 10 turmas

## 📊 Sistema de Analytics

O sistema inclui uma página completa de análises e métricas com:

- **Gráficos interativos** usando Chart.js
- **Métricas por turma** - Identifique quais turmas arrecadaram mais
- **Métricas por idade** - Análise por faixa etária
- **Métricas por sexo** - Distribuição de participação
- **Métricas por material** - Qual material foi mais reciclado
- **Estatísticas gerais** - Visão consolidada do sistema

Acesse através do menu "📊 Análises" ou consulte `ANALYTICS.md` para mais detalhes.

## 🧪 Testes

Para testar a API, você pode usar ferramentas como Postman ou Insomnia. Exemplos de requisições estão documentados nos controllers.

## 📄 Licença

Este é um protótipo acadêmico desenvolvido para fins educacionais.

## 🔗 Links Úteis

- [Guia de Instalação](INSTALACAO.md)
- [Documentação de Analytics](ANALYTICS.md)
- [Estrutura do Projeto](ESTRUTURA_PROJETO.md)
- [Guia para GitHub](GUIA_GITHUB.md)

## 👥 Contribuição

Este é um projeto acadêmico. Para contribuições, abra uma issue ou pull request no repositório.

## 📧 Contato

Para dúvidas ou sugestões, abra uma issue no repositório do GitHub.
