const pool = require('../src/config/database');

const createTables = async () => {
  try {
    // Tabela de usuários
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        nome VARCHAR(255) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        senha VARCHAR(255) NOT NULL,
        tipo VARCHAR(50) NOT NULL DEFAULT 'aluno',
        turma VARCHAR(100),
        idade INTEGER,
        sexo VARCHAR(20),
        data_criacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Tabela de registros de reciclagem
    await pool.query(`
      CREATE TABLE IF NOT EXISTS recycling_records (
        id SERIAL PRIMARY KEY,
        user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        tipo_material VARCHAR(50) NOT NULL,
        quantidade INTEGER NOT NULL DEFAULT 1,
        foto_url VARCHAR(500),
        pontos_gerados INTEGER NOT NULL,
        data_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Tabela de pontuação
    await pool.query(`
      CREATE TABLE IF NOT EXISTS scores (
        id SERIAL PRIMARY KEY,
        user_id INTEGER UNIQUE NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        pontos_totais INTEGER DEFAULT 0,
        nivel VARCHAR(50) DEFAULT 'iniciante',
        data_atualizacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Tabela de quizzes
    await pool.query(`
      CREATE TABLE IF NOT EXISTS quizzes (
        id SERIAL PRIMARY KEY,
        pergunta TEXT NOT NULL,
        resposta_correta VARCHAR(255) NOT NULL,
        alternativas JSONB NOT NULL,
        pontos INTEGER DEFAULT 50
      )
    `);

    // Tabela de respostas de quiz
    await pool.query(`
      CREATE TABLE IF NOT EXISTS quiz_answers (
        id SERIAL PRIMARY KEY,
        user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        quiz_id INTEGER NOT NULL REFERENCES quizzes(id) ON DELETE CASCADE,
        resposta_usuario VARCHAR(255) NOT NULL,
        correta BOOLEAN NOT NULL,
        data_resposta TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(user_id, quiz_id)
      )
    `);

    // Inserir quizzes iniciais
    await pool.query(`
      INSERT INTO quizzes (pergunta, resposta_correta, alternativas, pontos)
      VALUES 
        ('Qual material leva mais tempo para se decompor na natureza?', 'Plástico', 
         '["Papel", "Plástico", "Metal", "Vidro"]'::jsonb, 50),
        ('Qual é a cor da lixeira para reciclagem de papel?', 'Azul', 
         '["Verde", "Azul", "Amarelo", "Vermelho"]'::jsonb, 50),
        ('Quantos anos leva para uma garrafa PET se decompor?', 'Mais de 400 anos', 
         '["10 anos", "50 anos", "100 anos", "Mais de 400 anos"]'::jsonb, 50),
        ('Qual material pode ser reciclado infinitamente sem perder qualidade?', 'Vidro', 
         '["Papel", "Plástico", "Metal", "Vidro"]'::jsonb, 50),
        ('O que significa a sigla PET?', 'Polietileno Tereftalato', 
         '["Plástico Ecológico Total", "Polietileno Tereftalato", "Produto Ecologicamente Tratado", "Polímero Estrutural Térmico"]'::jsonb, 50)
      ON CONFLICT DO NOTHING
    `);

    console.log('✅ Tabelas criadas com sucesso!');
    console.log('✅ Quizzes iniciais inseridos!');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Erro ao criar tabelas:', error);
    process.exit(1);
  }
};

createTables();
