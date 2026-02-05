#  Estrutura do Projeto - Jogo Educativo de Reciclagem

##  Arquitetura Geral

O projeto segue uma arquitetura **cliente-servidor** com separação clara entre front-end e back-end.

```
projeto-faucl/
├── backend/              # API REST (Node.js + Express)
├── frontend/             # Interface Web (React.js)
├── README.md             # Documentação principal
├── INSTALACAO.md         # Guia de instalação
└── ESTRUTURA_PROJETO.md  # Este arquivo
```

##  Back-end (API REST)

### Estrutura de Pastas

```
backend/
├── src/
│   ├── config/
│   │   └── database.js          # Configuração do PostgreSQL
│   ├── controllers/
│   │   ├── userController.js    # Lógica de usuários (cadastro, login)
│   │   ├── recyclingController.js # Lógica de reciclagem
│   │   ├── quizController.js    # Lógica de quizzes
│   │   ├── rankingController.js  # Lógica de ranking
│   │   └── scoreController.js   # Lógica de pontuação
│   ├── middleware/
│   │   └── auth.js              # Middleware de autenticação JWT
│   ├── routes/
│   │   ├── userRoutes.js        # Rotas de usuários
│   │   ├── recyclingRoutes.js   # Rotas de reciclagem
│   │   ├── quizRoutes.js        # Rotas de quizzes
│   │   ├── rankingRoutes.js     # Rotas de ranking
│   │   └── scoreRoutes.js       # Rotas de pontuação
│   └── utils/
│       └── gamification.js      # Regras de gamificação
├── migrations/
│   └── createTables.js          # Script de criação das tabelas
├── uploads/                     # Pasta para imagens (criada automaticamente)
├── .env                         # Variáveis de ambiente (criar)
├── .env.example                 # Exemplo de variáveis
├── package.json                 # Dependências Node.js
└── server.js                    # Arquivo principal do servidor
```

### Endpoints da API

#### Autenticação e Usuários
- `POST /api/users/register` - Cadastro de usuário
- `POST /api/users/login` - Login
- `GET /api/users/:id` - Dados do usuário

#### Reciclagem
- `POST /api/recycling-records` - Registrar reciclagem (com upload de imagem)
- `GET /api/recycling-records/user/:userId` - Histórico do usuário

#### Quizzes
- `GET /api/quizzes` - Listar todos os quizzes
- `POST /api/quizzes/answer` - Responder um quiz

#### Ranking e Pontuação
- `GET /api/ranking` - Ranking geral
- `GET /api/scores/:userId` - Pontuação do usuário

#### Health Check
- `GET /api/health` - Verificar status da API

## 🎨 Front-end (React.js)

### Estrutura de Pastas

```
frontend/
├── public/
│   └── index.html              # HTML principal
├── src/
│   ├── components/
│   │   ├── Navbar.js          # Barra de navegação
│   │   └── Navbar.css
│   ├── pages/
│   │   ├── Login.js           # Página de login
│   │   ├── Register.js        # Página de cadastro
│   │   ├── Dashboard.js       # Dashboard principal
│   │   ├── RecyclingForm.js   # Formulário de reciclagem
│   │   ├── Quiz.js            # Página de quizzes
│   │   ├── Ranking.js         # Página de ranking
│   │   └── History.js         # Histórico de reciclagem
│   ├── services/
│   │   └── api.js             # Configuração do Axios
│   ├── App.js                 # Componente principal
│   ├── App.css
│   ├── index.js               # Ponto de entrada
│   └── index.css              # Estilos globais
├── .env                       # Variáveis de ambiente (criar)
├── .env.example               # Exemplo de variáveis
└── package.json               # Dependências React
```

### Rotas da Aplicação

- `/` - Redireciona para login ou dashboard
- `/login` - Tela de login
- `/register` - Tela de cadastro
- `/dashboard` - Dashboard principal
- `/recycling` - Registrar reciclagem
- `/quiz` - Responder quizzes
- `/ranking` - Ver ranking
- `/history` - Ver histórico

##  Banco de Dados (PostgreSQL)

### Tabelas

#### `users`
- `id` (SERIAL PRIMARY KEY)
- `nome` (VARCHAR)
- `email` (VARCHAR UNIQUE)
- `senha` (VARCHAR - hash bcrypt)
- `tipo` (VARCHAR - 'aluno' ou 'professor')
- `data_criacao` (TIMESTAMP)

#### `recycling_records`
- `id` (SERIAL PRIMARY KEY)
- `user_id` (INTEGER - FK para users)
- `tipo_material` (VARCHAR - 'papel', 'plástico', 'metal', 'vidro')
- `quantidade` (INTEGER)
- `foto_url` (VARCHAR - opcional)
- `pontos_gerados` (INTEGER)
- `data_registro` (TIMESTAMP)

#### `scores`
- `id` (SERIAL PRIMARY KEY)
- `user_id` (INTEGER UNIQUE - FK para users)
- `pontos_totais` (INTEGER)
- `nivel` (VARCHAR - 'iniciante', 'consciente', 'sustentável', 'agente verde')
- `data_atualizacao` (TIMESTAMP)

#### `quizzes`
- `id` (SERIAL PRIMARY KEY)
- `pergunta` (TEXT)
- `resposta_correta` (VARCHAR)
- `alternativas` (JSONB)
- `pontos` (INTEGER - padrão 50)

#### `quiz_answers`
- `id` (SERIAL PRIMARY KEY)
- `user_id` (INTEGER - FK para users)
- `quiz_id` (INTEGER - FK para quizzes)
- `resposta_usuario` (VARCHAR)
- `correta` (BOOLEAN)
- `data_resposta` (TIMESTAMP)
- UNIQUE(user_id, quiz_id)

## Sistema de Gamificação

### Pontuação por Material
- **Papel**: 10 pontos/unidade
- **Plástico**: 15 pontos/unidade
- **Metal**: 20 pontos/unidade
- **Vidro**: 25 pontos/unidade
- **Quiz correto**: 50 pontos extras

### Níveis
- **Iniciante**: 0-100 pontos 🌱
- **Consciente**: 101-300 pontos 🌿
- **Sustentável**: 301-600 pontos 🌳
- **Agente Verde**: 601+ pontos 🏆

##  Segurança

- Autenticação via JWT (JSON Web Tokens)
- Senhas criptografadas com bcrypt
- Validação de dados no back-end
- Middleware de autenticação para rotas protegidas

##  Dependências Principais

### Back-end
- `express` - Framework web
- `pg` - Cliente PostgreSQL
- `bcryptjs` - Criptografia de senhas
- `jsonwebtoken` - Autenticação JWT
- `multer` - Upload de arquivos
- `cors` - Cross-Origin Resource Sharing
- `dotenv` - Variáveis de ambiente

### Front-end
- `react` - Biblioteca UI
- `react-router-dom` - Roteamento
- `axios` - Cliente HTTP
- `chart.js` / `react-chartjs-2` - Gráficos (preparado para uso futuro)

##  Fluxo de Dados

1. **Usuário interage** com a interface React
2. **Front-end envia** requisição HTTP para a API
3. **Back-end processa** a requisição (validação, regras de negócio)
4. **Banco de dados** persiste ou consulta dados
5. **Back-end retorna** resposta JSON
6. **Front-end atualiza** a interface com os dados recebidos

##  Notas Importantes

- O projeto é um **protótipo funcional** para testes piloto
- Foco em **funcionalidade e clareza arquitetural**
- Não está otimizado para escala comercial
- Ideal para ambiente escolar e testes educacionais

---

**Última atualização**: 2025
