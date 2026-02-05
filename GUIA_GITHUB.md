# 📤 Guia para Enviar Código para o GitHub

## Pré-requisitos

1. **Instalar Git** (se ainda não tiver):
   - Download: https://git-scm.com/download/win
   - Instale e reinicie o terminal

2. **Configurar Git** (primeira vez):
   ```bash
   git config --global user.name "Seu Nome"
   git config --global user.email "seu@email.com"
   ```

## 🚀 Passo a Passo

### 1. Abrir Terminal na Pasta do Projeto

Abra o PowerShell ou Git Bash na pasta do projeto:
```
C:\Users\guilherme.schneider\OneDrive - La Moda\Área de Trabalho\projeto Faucl
```

### 2. Inicializar o Repositório Git

```bash
git init
```

### 3. Adicionar Todos os Arquivos

```bash
git add .
```

### 4. Fazer o Primeiro Commit

```bash
git commit -m "Initial commit: Jogo educativo de reciclagem sustentável"
```

### 5. Adicionar o Remote do GitHub

```bash
git remote add origin https://github.com/Dhaaki/ReciclaGame.git
```

### 6. Verificar o Remote

```bash
git remote -v
```

Deve mostrar:
```
origin  https://github.com/Dhaaki/ReciclaGame.git (fetch)
origin  https://github.com/Dhaaki/ReciclaGame.git (push)
```

### 7. Fazer Push para o GitHub

```bash
git branch -M main
git push -u origin main
```

**Nota**: Se pedir autenticação:
- Use um **Personal Access Token** (não a senha)
- Como criar: https://github.com/settings/tokens
- Permissões necessárias: `repo`

## 🔄 Comandos Rápidos (Para Futuras Atualizações)

```bash
# Verificar mudanças
git status

# Adicionar arquivos modificados
git add .

# Fazer commit
git commit -m "Descrição das mudanças"

# Enviar para o GitHub
git push
```

## 📝 Estrutura do Projeto que Será Enviada

```
projeto-faucl/
├── backend/          # API REST (Node.js + Express)
├── frontend/         # Interface React
├── README.md         # Documentação principal
├── INSTALACAO.md     # Guia de instalação
├── ANALYTICS.md      # Documentação de analytics
├── .gitignore        # Arquivos ignorados
└── ... outros arquivos
```

## ⚠️ Arquivos que NÃO Serão Enviados

- `node_modules/` (dependências)
- `.env` (variáveis de ambiente - contém senhas)
- `backend/uploads/` (imagens enviadas)
- Arquivos temporários

## 🔐 Autenticação no GitHub

Se der erro de autenticação:

1. **Criar Personal Access Token:**
   - Acesse: https://github.com/settings/tokens
   - Clique em "Generate new token (classic)"
   - Dê um nome (ex: "ReciclaGame")
   - Selecione a permissão `repo`
   - Clique em "Generate token"
   - **Copie o token** (só aparece uma vez!)

2. **Usar o token no lugar da senha:**
   - Quando pedir senha, cole o token

## 🐛 Solução de Problemas

### Erro: "remote origin already exists"
```bash
git remote remove origin
git remote add origin https://github.com/Dhaaki/ReciclaGame.git
```

### Erro: "failed to push some refs"
```bash
git pull origin main --allow-unrelated-histories
git push -u origin main
```

### Erro: "authentication failed"
- Verifique se está usando Personal Access Token
- Verifique se o token tem permissão `repo`

## 📚 Comandos Úteis

```bash
# Ver histórico de commits
git log

# Ver mudanças não commitadas
git diff

# Desfazer mudanças em um arquivo
git checkout -- nome-do-arquivo

# Ver branches
git branch
```

## ✅ Checklist Antes de Enviar

- [ ] Git instalado e configurado
- [ ] `.env` não está sendo enviado (está no .gitignore)
- [ ] `node_modules` não está sendo enviado
- [ ] Código testado e funcionando
- [ ] README.md atualizado
- [ ] Commit com mensagem descritiva

---

**Dica**: Após o primeiro push, você pode usar ferramentas como GitHub Desktop para facilitar futuros commits!
