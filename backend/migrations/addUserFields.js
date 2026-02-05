const pool = require('../src/config/database');

const addUserFields = async () => {
  try {
    // Adicionar colunas uma por vez (PostgreSQL não permite múltiplas em uma única ALTER TABLE)
    await pool.query(`
      ALTER TABLE users 
      ADD COLUMN IF NOT EXISTS turma VARCHAR(100)
    `);
    
    await pool.query(`
      ALTER TABLE users 
      ADD COLUMN IF NOT EXISTS idade INTEGER
    `);
    
    await pool.query(`
      ALTER TABLE users 
      ADD COLUMN IF NOT EXISTS sexo VARCHAR(20)
    `);

    console.log('✅ Campos adicionados à tabela users com sucesso!');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Erro ao adicionar campos:', error);
    process.exit(1);
  }
};

addUserFields();
