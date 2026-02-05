# 🔧 Solução para Erro 404 (Request failed with status code 404)

## Problema
O erro 404 significa que a rota não foi encontrada. Isso geralmente acontece quando:

1. **O servidor back-end não está rodando**
2. **A URL da API está incorreta**
3. **A porta do servidor está diferente**

## ✅ Soluções

### 1. Verificar se o Back-end está Rodando

Abra um terminal e verifique:

```bash
cd backend
npm start
```

Você deve ver a mensagem:
```
🚀 Servidor rodando na porta 3001
```

**Importante**: O servidor precisa estar rodando ANTES de usar o front-end!

### 2. Verificar a URL da API

#### No Front-end:

Crie ou verifique o arquivo `.env` na pasta `frontend`:

```env
REACT_APP_API_URL=http://localhost:3001/api
```

**⚠️ IMPORTANTE**: 
- O arquivo deve estar na pasta `frontend` (não em `frontend/src`)
- Após criar/editar o `.env`, **reinicie o servidor do React** (Ctrl+C e `npm start` novamente)

#### Verificar no Código:

O arquivo `frontend/src/services/api.js` deve ter:

```javascript
baseURL: process.env.REACT_APP_API_URL || 'http://localhost:3001/api',
```

### 3. Testar a Conexão

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

Se não funcionar, o back-end não está rodando corretamente.

### 4. Verificar a Rota Específica

Para cadastro, a rota deve ser:

```
POST http://localhost:3001/api/users/register
```

Teste no navegador (apenas para verificar se existe):
```
http://localhost:3001/api/users/register
```

Isso deve retornar um erro de método (405), não 404. Se retornar 404, a rota não está registrada.

### 5. Verificar Console do Navegador

1. Abra o navegador
2. Pressione **F12** (ou clique com botão direito → Inspecionar)
3. Vá na aba **Console**
4. Tente cadastrar novamente
5. Veja qual é a URL exata que está sendo chamada

A URL deve ser algo como:
```
http://localhost:3001/api/users/register
```

### 6. Verificar CORS

Se o back-end estiver rodando mas ainda der erro, verifique se o CORS está habilitado no `backend/server.js`:

```javascript
app.use(cors());
```

## 🔍 Checklist Rápido

- [ ] Back-end está rodando na porta 3001?
- [ ] Front-end está rodando na porta 3000?
- [ ] Arquivo `.env` existe na pasta `frontend`?
- [ ] Arquivo `.env` tem `REACT_APP_API_URL=http://localhost:3001/api`?
- [ ] Servidor React foi reiniciado após criar/editar `.env`?
- [ ] `http://localhost:3001/api/health` retorna OK?

## 🚀 Passo a Passo Completo

1. **Terminal 1 - Back-end:**
   ```bash
   cd backend
   npm install  # se ainda não instalou
   npm start
   ```

2. **Terminal 2 - Front-end:**
   ```bash
   cd frontend
   npm install  # se ainda não instalou
   
   # Criar arquivo .env se não existir
   echo REACT_APP_API_URL=http://localhost:3001/api > .env
   
   npm start
   ```

3. **Testar:**
   - Acesse `http://localhost:3000`
   - Tente fazer o cadastro
   - Verifique o console do navegador (F12) se ainda der erro

## 💡 Dica

Se você mudou o arquivo `.env` do front-end, **sempre reinicie o servidor React** para as mudanças terem efeito!

## 🐛 Se Ainda Não Funcionar

1. **Verifique os logs do back-end** - deve mostrar as requisições recebidas
2. **Verifique o console do navegador** - mostra a URL exata e o erro
3. **Teste a API diretamente** com Postman ou Insomnia:
   - URL: `http://localhost:3001/api/users/register`
   - Método: POST
   - Body (JSON):
     ```json
     {
       "nome": "Teste",
       "email": "teste@teste.com",
       "senha": "123456",
       "tipo": "aluno"
     }
     ```
