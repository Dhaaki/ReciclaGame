# 🔧 Solução para Erro de Cadastro

## Problema
Se você está recebendo "Erro ao cadastrar", provavelmente a tabela `users` não tem as colunas `turma`, `idade` e `sexo`.

## ✅ Solução Rápida

### Opção 1: Executar a Migration (Recomendado)

Se você já tinha o banco criado antes, execute:

```bash
cd backend
npm run migrate:add-fields
```

Isso adicionará as colunas necessárias à tabela.

### Opção 2: Recriar as Tabelas (Se não tiver dados importantes)

Se você não tem dados importantes no banco, pode recriar tudo:

```bash
cd backend
# Deletar e recriar o banco
psql -U postgres -c "DROP DATABASE IF EXISTS reciclagem_game;"
psql -U postgres -c "CREATE DATABASE reciclagem_game;"

# Executar migration completa
npm run migrate
```

### Opção 3: Adicionar Manualmente via SQL

Se preferir fazer manualmente:

```sql
-- Conectar ao banco
psql -U postgres -d reciclagem_game

-- Adicionar as colunas
ALTER TABLE users ADD COLUMN IF NOT EXISTS turma VARCHAR(100);
ALTER TABLE users ADD COLUMN IF NOT EXISTS idade INTEGER;
ALTER TABLE users ADD COLUMN IF NOT EXISTS sexo VARCHAR(20);
```

## 🔍 Verificar se Funcionou

Após executar a migration, teste o cadastro novamente. O código agora está preparado para:

1. Mostrar mensagens de erro mais específicas
2. Funcionar mesmo se as colunas não existirem (usando inserção básica)
3. Converter idade para número automaticamente

## 📝 Teste de Cadastro

Use os seguintes dados para teste:

- **Nome**: GUILHERME SCHNEIDER
- **Email**: guigamilak@gmail.com
- **Senha**: 123456
- **Tipo**: Professor (ou Aluno)
- **Turma**: (opcional, apenas para alunos)
- **Idade**: (opcional, apenas para alunos)
- **Sexo**: (opcional, apenas para alunos)

## 🐛 Se Ainda Der Erro

1. **Verifique os logs do back-end** no terminal onde está rodando o servidor
2. **Verifique o console do navegador** (F12) para ver erros detalhados
3. **Confirme que o banco está rodando**: `psql -U postgres -l`
4. **Confirme as variáveis de ambiente** no arquivo `.env` do backend

## 💡 Dica

O código agora mostra mensagens de erro mais específicas. Se ainda der erro, a mensagem exibida deve indicar o problema real (ex: "column turma does not exist" ou "connection refused").
