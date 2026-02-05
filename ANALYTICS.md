# 📊 Sistema de Análises e Métricas

## Visão Geral

O sistema de análises fornece métricas detalhadas sobre o desempenho dos alunos, materiais reciclados e estatísticas por turma, idade e sexo. Esta funcionalidade é especialmente útil para professores e administradores acompanharem o progresso do programa de reciclagem.

## 🎯 Funcionalidades Implementadas

### 1. Estatísticas Gerais
- Total de alunos cadastrados
- Total de registros de reciclagem
- Total de materiais reciclados
- Pontos totais acumulados
- Número de turmas participantes
- Média de pontos por aluno

### 2. Métricas por Turma
- Total de alunos por turma
- Total de materiais reciclados por turma
- Total de pontos por turma
- Média de pontos por turma
- Ranking das turmas

### 3. Métricas por Idade
- Distribuição por faixa etária:
  - Menos de 10 anos
  - 10-11 anos
  - 12-13 anos
  - 14+ anos
  - Não informado
- Total de materiais por faixa etária
- Total de pontos por faixa etária

### 4. Métricas por Sexo
- Distribuição por sexo (Masculino, Feminino, Outro, Não informado)
- Total de materiais reciclados por sexo
- Total de pontos por sexo
- Média de pontos por sexo

### 5. Métricas por Material
- Tipo de material mais reciclado
- Total de registros por material
- Total de quantidade por material
- Total de pontos gerados por material
- Média de quantidade por registro

### 6. Top 10 Turmas
- Ranking das 10 turmas com maior pontuação
- Total de alunos por turma
- Total de pontos por turma

## 📈 Visualizações

A página de Analytics inclui os seguintes gráficos:

1. **Gráfico de Barras - Materiais Mais Reciclados**
   - Mostra a quantidade total de cada tipo de material reciclado
   - Cores diferentes para cada material

2. **Gráfico de Barras - Top 10 Turmas**
   - Ranking visual das turmas com maior pontuação
   - Facilita identificação das turmas mais engajadas

3. **Gráfico de Barras - Reciclagem por Faixa Etária**
   - Distribuição de materiais reciclados por idade
   - Ajuda a entender o engajamento por faixa etária

4. **Gráfico de Rosca (Doughnut) - Reciclagem por Sexo**
   - Distribuição percentual por sexo
   - Visualização clara da participação

## 🔌 Endpoints da API

### GET /api/analytics/geral
Retorna estatísticas gerais do sistema.

**Resposta:**
```json
{
  "total_alunos": 150,
  "total_registros": 500,
  "total_materiais": 1200,
  "total_pontos_geral": 25000,
  "media_pontos_geral": 166.67,
  "total_turmas": 8
}
```

### GET /api/analytics/turma
Retorna métricas agrupadas por turma.

**Resposta:**
```json
[
  {
    "turma": "5º Ano A",
    "total_alunos": 25,
    "total_materiais": 300,
    "total_pontos": 5000,
    "media_pontos": 200
  }
]
```

### GET /api/analytics/idade
Retorna métricas agrupadas por faixa etária.

**Resposta:**
```json
[
  {
    "faixa_etaria": "10-11 anos",
    "total_alunos": 50,
    "total_materiais": 400,
    "total_pontos": 8000
  }
]
```

### GET /api/analytics/sexo
Retorna métricas agrupadas por sexo.

**Resposta:**
```json
[
  {
    "sexo": "Masculino",
    "total_alunos": 75,
    "total_materiais": 600,
    "total_pontos": 12000,
    "media_pontos": 160
  }
]
```

### GET /api/analytics/material
Retorna métricas agrupadas por tipo de material.

**Resposta:**
```json
[
  {
    "tipo_material": "plástico",
    "total_registros": 200,
    "total_quantidade": 500,
    "total_pontos": 7500,
    "media_quantidade": 2.5
  }
]
```

### GET /api/analytics/top-turmas
Retorna as 10 turmas com maior pontuação.

**Resposta:**
```json
[
  {
    "turma": "6º Ano B",
    "total_alunos": 28,
    "total_pontos": 8500
  }
]
```

## 📝 Campos Adicionados ao Cadastro

Para habilitar as análises, foram adicionados os seguintes campos opcionais no cadastro de alunos:

- **Turma**: Nome da turma (ex: "5º Ano A", "6º Ano B")
- **Idade**: Idade do aluno (número inteiro)
- **Sexo**: Masculino, Feminino, Outro, ou Prefiro não informar

**Nota**: Esses campos são opcionais, mas recomendados para análises mais completas.

## 🗄️ Atualização do Banco de Dados

Para adicionar os novos campos à tabela `users`, execute:

```bash
cd backend
npm run migrate:add-fields
```

Ou se preferir criar as tabelas do zero com os novos campos:

```bash
cd backend
npm run migrate
```

## 🎨 Acesso à Página de Analytics

A página de Analytics está disponível para todos os usuários autenticados através de:

1. **Menu de Navegação**: Link "📊 Análises" na barra superior
2. **Dashboard**: Card especial para professores
3. **URL Direta**: `/analytics`

## 📊 Exemplos de Uso

### Para Professores
- Identificar turmas que precisam de mais incentivo
- Comparar desempenho entre turmas
- Acompanhar evolução ao longo do tempo
- Gerar relatórios para a direção

### Para Administradores
- Analisar materiais mais reciclados
- Identificar padrões por faixa etária
- Avaliar engajamento por gênero
- Planejar campanhas específicas

## 🔒 Segurança

- Todos os endpoints de analytics requerem autenticação (JWT)
- Apenas usuários autenticados podem acessar as métricas
- Os dados são agregados e não expõem informações individuais sensíveis

## 🚀 Melhorias Futuras

Possíveis melhorias para o sistema de analytics:

- [ ] Filtros por período (data inicial e final)
- [ ] Exportação de relatórios em PDF/Excel
- [ ] Gráficos de evolução temporal
- [ ] Comparação entre períodos
- [ ] Métricas por nível de gamificação
- [ ] Dashboard personalizável
- [ ] Alertas e notificações

---

**Última atualização**: 2025
