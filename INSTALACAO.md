# 📦 Guia de Instalação - Jogo Educativo de Reciclagem

Este guia detalha passo a passo como configurar e executar o projeto.

## 📋 Pré-requisitos

Antes de começar, certifique-se de ter instalado:

- **Node.js** (versão 16 ou superior) - [Download](https://nodejs.org/)
- **PostgreSQL** (versão 12 ou superior) - [Download](https://www.postgresql.org/download/)
- **npm** ou **yarn** (vem com Node.js)

## 🗄️ Passo 1: Configurar o Banco de Dados

### 1.1. Criar o Banco de Dados

Abra o terminal e execute:

```bash
# Windows (PowerShell)
psql -U postgres
CREATE DATABASE reciclagem_game;
\q

# Linux/Mac
createdb reciclagem_game
```

### 1.2. Verificar Conexão

Certifique-se de que o PostgreSQL está rodando e acessível.

## ⚙️ Passo 2: Configurar o Back-end

### 2.1. Instalar Dependências

```bash
cd backend
npm install
```

### 2.2. Configurar Variáveis de Ambiente

Crie um arquivo `.env` na pasta `backend` com o seguinte conteúdo:

```env
DB_HOST=localhost
DB_PORT=5432
DB_NAME=reciclagem_game
DB_USER=postgres
DB_PASSWORD=sua_senha_aqui
PORT=3001
JWT_SECRET=seu_secret_jwt_muito_seguro_aqui_use_uma_string_aleatoria
```

**⚠️ IMPORTANTE:**
- Substitua `sua_senha_aqui` pela senha do seu PostgreSQL
- Substitua `seu_secret_jwt_muito_seguro_aqui` por uma string aleatória segura (ex: use um gerador online)

### 2.3. Criar Tabelas no Banco

Execute o script de migração:

```bash
npm run migrate
```

Você deve ver a mensagem:
```
✅ Tabelas criadas com sucesso!
✅ Quizzes iniciais inseridos!
```

**Se você já tinha o banco criado anteriormente**, execute também:

```bash
npm run migrate:add-fields
```

Isso adicionará os campos `turma`, `idade` e `sexo` à tabela de usuários para habilitar as análises.

### 2.4. Criar Pasta de Uploads

A pasta `uploads` deve ser criada automaticamente, mas se necessário:

```bash
# Windows
mkdir uploads

# Linux/Mac
mkdir -p uploads
```

### 2.5. Iniciar o Servidor Back-end

```bash
npm start
```

O servidor estará rodando em `http://localhost:3001`

Para desenvolvimento com auto-reload:

```bash
npm run dev
```

## 🎨 Passo 3: Configurar o Front-end

### 3.1. Instalar Dependências

Abra um **novo terminal** e execute:

```bash
cd frontend
npm install
```

### 3.2. Configurar Variáveis de Ambiente

Crie um arquivo `.env` na pasta `frontend`:

```env
REACT_APP_API_URL=http://localhost:3001
```

### 3.3. Iniciar o Front-end

```bash
npm start
```

A aplicação abrirá automaticamente em `http://localhost:3000`

## ✅ Passo 4: Verificar Instalação

### 4.1. Testar Back-end

Abra o navegador e acesse:
```
http://localhost:3001/api/health
```

Você deve ver:
```json
{
  "status": "OK",
  "message": "API funcionando!"
}
```

### 4.2. Testar Front-end

Acesse `http://localhost:3000` e você verá a tela de login.

## 🎮 Passo 5: Primeiro Uso

1. **Cadastre um usuário** clicando em "Cadastre-se"
2. **Faça login** com suas credenciais
3. **Explore o Dashboard** e comece a registrar reciclagens!

## 🐛 Solução de Problemas

### Erro: "Cannot connect to database"

- Verifique se o PostgreSQL está rodando
- Confirme as credenciais no arquivo `.env`
- Teste a conexão: `psql -U postgres -d reciclagem_game`

### Erro: "Port 3001 already in use"

- Altere a porta no arquivo `.env` do back-end
- Atualize a URL no arquivo `.env` do front-end

### Erro: "Module not found"

- Execute `npm install` novamente na pasta correspondente
- Verifique se está na pasta correta (backend ou frontend)

### Erro ao fazer upload de imagem

- Certifique-se de que a pasta `backend/uploads` existe
- Verifique as permissões da pasta

## 📝 Estrutura de Arquivos

```
projeto-faucl/
├── backend/
│   ├── src/
│   │   ├── config/          # Configurações (banco de dados)
│   │   ├── controllers/     # Lógica de negócio
│   │   ├── middleware/      # Middlewares (autenticação)
│   │   ├── routes/          # Rotas da API
│   │   └── utils/           # Utilitários (gamificação)
│   ├── migrations/          # Scripts de migração
│   ├── uploads/             # Imagens enviadas
│   ├── .env                 # Variáveis de ambiente (criar)
│   └── server.js            # Arquivo principal
├── frontend/
│   ├── src/
│   │   ├── components/      # Componentes reutilizáveis
│   │   ├── pages/           # Páginas da aplicação
│   │   ├── services/        # Serviços (API)
│   │   └── App.js           # Componente principal
│   ├── .env                 # Variáveis de ambiente (criar)
│   └── public/
└── README.md
```

## 🚀 Próximos Passos

Após a instalação bem-sucedida:

1. Explore todas as funcionalidades
2. Teste o sistema de pontuação
3. Responda aos quizzes
4. Veja o ranking
5. Registre materiais reciclados

## 📞 Suporte

Em caso de dúvidas ou problemas, verifique:
- Os logs do terminal (back-end e front-end)
- O console do navegador (F12)
- As mensagens de erro específicas

---

**Boa sorte com o projeto! 🌱♻️**
