# 🌱 Seed do Banco de Dados

## O que é?

O seed é um script que popula o banco de dados com dados de teste/simulação para facilitar o desenvolvimento e testes da aplicação.

## 📊 Dados Criados

O script cria:

- **2 Professores** com credenciais de acesso
- **17 Alunos** com dados variados:
  - Diferentes turmas (5º, 6º, 7º ano)
  - Diferentes idades (10-14 anos)
  - Diferentes sexos (Masculino, Feminino)
  - Alguns sem dados completos (para testar campos opcionais)
- **Pontuações** variadas para cada aluno
- **Registros de reciclagem** (5-20 por aluno, com materiais variados)
- **Respostas de quiz** (alguns corretos, alguns incorretos)

## 🚀 Como Usar

### 1. Certifique-se de que as tabelas existem

```bash
cd backend
npm run migrate
```

### 2. Execute o seed

```bash
npm run seed
```

### 3. Aguarde a conclusão

O script mostrará o progresso e estatísticas finais.

## 🔑 Credenciais de Teste

**Senha padrão para todos os usuários:** `123456`

### Exemplos de Login:

**Professores:**
- Email: `maria.silva@escola.com`
- Email: `joao.santos@escola.com`

**Alunos:**
- Email: `ana.costa@teste.com`
- Email: `bruno.oliveira@teste.com`
- Email: `felipe.alves@teste.com`
- Email: `larissa.gomes@teste.com`
- ... (veja a lista completa no console após executar o seed)

## ⚠️ Atenção

O script **limpa** alguns dados existentes antes de inserir os novos:
- Respostas de quiz
- Registros de reciclagem
- Pontuações
- Usuários com email contendo "teste" ou "fake"

**Dados que NÃO são apagados:**
- Quizzes (perguntas)
- Usuários reais (que não tenham "teste" ou "fake" no email)

## 📝 Personalização

Você pode editar o arquivo `seedDatabase.js` para:
- Adicionar mais alunos
- Mudar as turmas
- Ajustar a quantidade de registros
- Modificar as pontuações
- Etc.

## 🔄 Executar Novamente

Se quiser limpar e recriar os dados de teste:

```bash
npm run seed
```

O script pode ser executado quantas vezes quiser.

## 📊 Estatísticas

Após executar, você verá:
- Total de alunos criados
- Total de professores criados
- Total de registros de reciclagem
- Total de pontos acumulados

Isso ajuda a verificar se tudo foi criado corretamente.
