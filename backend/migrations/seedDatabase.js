const pool = require('../src/config/database');
const bcrypt = require('bcryptjs');

const seedDatabase = async () => {
  try {
    console.log('🌱 Iniciando seed do banco de dados...\n');

    // Limpar dados existentes (opcional - comentar se quiser manter dados existentes)
    console.log('🧹 Limpando dados existentes...');
    await pool.query('DELETE FROM quiz_answers');
    await pool.query('DELETE FROM recycling_records');
    await pool.query('DELETE FROM scores');
    await pool.query("DELETE FROM users WHERE email LIKE '%teste%' OR email LIKE '%fake%'");
    console.log('✅ Dados limpos\n');

    // Hash de senha padrão para todos os usuários de teste
    const senhaHash = await bcrypt.hash('123456', 10);

    // Criar professores
    console.log('👨‍🏫 Criando professores...');
    const professores = [
      { nome: 'Prof. Maria Silva', email: 'maria.silva@escola.com', tipo: 'professor' },
      { nome: 'Prof. João Santos', email: 'joao.santos@escola.com', tipo: 'professor' }
    ];

    const professoresIds = [];
    for (const prof of professores) {
      const result = await pool.query(
        'INSERT INTO users (nome, email, senha, tipo) VALUES ($1, $2, $3, $4) RETURNING id',
        [prof.nome, prof.email, senhaHash, prof.tipo]
      );
      professoresIds.push(result.rows[0].id);
    }
    console.log(`✅ ${professores.length} professores criados\n`);

    // Criar alunos com dados variados
    console.log('👨‍🎓 Criando alunos...');
    const alunos = [
      // 5º Ano
      { nome: 'Ana Costa', email: 'ana.costa@teste.com', tipo: 'aluno', turma: '5º Ano A', idade: 10, sexo: 'Feminino' },
      { nome: 'Bruno Oliveira', email: 'bruno.oliveira@teste.com', tipo: 'aluno', turma: '5º Ano A', idade: 11, sexo: 'Masculino' },
      { nome: 'Carla Mendes', email: 'carla.mendes@teste.com', tipo: 'aluno', turma: '5º Ano A', idade: 10, sexo: 'Feminino' },
      { nome: 'Diego Souza', email: 'diego.souza@teste.com', tipo: 'aluno', turma: '5º Ano B', idade: 11, sexo: 'Masculino' },
      { nome: 'Elena Ferreira', email: 'elena.ferreira@teste.com', tipo: 'aluno', turma: '5º Ano B', idade: 10, sexo: 'Feminino' },
      
      // 6º Ano
      { nome: 'Felipe Alves', email: 'felipe.alves@teste.com', tipo: 'aluno', turma: '6º Ano A', idade: 12, sexo: 'Masculino' },
      { nome: 'Gabriela Lima', email: 'gabriela.lima@teste.com', tipo: 'aluno', turma: '6º Ano A', idade: 12, sexo: 'Feminino' },
      { nome: 'Henrique Rocha', email: 'henrique.rocha@teste.com', tipo: 'aluno', turma: '6º Ano A', idade: 13, sexo: 'Masculino' },
      { nome: 'Isabela Martins', email: 'isabela.martins@teste.com', tipo: 'aluno', turma: '6º Ano B', idade: 12, sexo: 'Feminino' },
      { nome: 'Julio Pereira', email: 'julio.pereira@teste.com', tipo: 'aluno', turma: '6º Ano B', idade: 12, sexo: 'Masculino' },
      
      // 7º Ano
      { nome: 'Larissa Gomes', email: 'larissa.gomes@teste.com', tipo: 'aluno', turma: '7º Ano A', idade: 13, sexo: 'Feminino' },
      { nome: 'Marcos Dias', email: 'marcos.dias@teste.com', tipo: 'aluno', turma: '7º Ano A', idade: 14, sexo: 'Masculino' },
      { nome: 'Natália Ribeiro', email: 'natalia.ribeiro@teste.com', tipo: 'aluno', turma: '7º Ano A', idade: 13, sexo: 'Feminino' },
      { nome: 'Otávio Barbosa', email: 'otavio.barbosa@teste.com', tipo: 'aluno', turma: '7º Ano B', idade: 14, sexo: 'Masculino' },
      { nome: 'Paula Cardoso', email: 'paula.cardoso@teste.com', tipo: 'aluno', turma: '7º Ano B', idade: 13, sexo: 'Feminino' },
      
      // Alguns sem turma/idade/sexo para testar
      { nome: 'Rafael Teixeira', email: 'rafael.teixeira@teste.com', tipo: 'aluno', turma: null, idade: null, sexo: null },
      { nome: 'Sofia Araújo', email: 'sofia.araujo@teste.com', tipo: 'aluno', turma: '6º Ano C', idade: 12, sexo: 'Feminino' }
    ];

    const alunosIds = [];
    for (const aluno of alunos) {
      const result = await pool.query(
        'INSERT INTO users (nome, email, senha, tipo, turma, idade, sexo) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING id',
        [aluno.nome, aluno.email, senhaHash, aluno.tipo, aluno.turma, aluno.idade, aluno.sexo]
      );
      alunosIds.push(result.rows[0].id);
    }
    console.log(`✅ ${alunos.length} alunos criados\n`);

    // Criar pontuações iniciais
    console.log('⭐ Criando pontuações...');
    const niveis = ['iniciante', 'consciente', 'sustentável', 'agente verde'];
    const pontosPorNivel = [50, 200, 450, 800]; // Pontos para cada nível

    for (let i = 0; i < alunosIds.length; i++) {
      const nivelIndex = Math.floor(Math.random() * niveis.length);
      const pontos = pontosPorNivel[nivelIndex] + Math.floor(Math.random() * 100);
      
      await pool.query(
        'INSERT INTO scores (user_id, pontos_totais, nivel) VALUES ($1, $2, $3)',
        [alunosIds[i], pontos, niveis[nivelIndex]]
      );
    }
    console.log(`✅ ${alunosIds.length} pontuações criadas\n`);

    // Criar registros de reciclagem
    console.log('♻️ Criando registros de reciclagem...');
    const materiais = ['papel', 'plástico', 'metal', 'vidro'];
    const pontosPorMaterial = { papel: 10, plástico: 15, metal: 20, vidro: 25 };

    let totalRegistros = 0;
    for (let i = 0; i < alunosIds.length; i++) {
      const numRegistros = Math.floor(Math.random() * 15) + 5; // 5 a 20 registros por aluno
      
      for (let j = 0; j < numRegistros; j++) {
        const material = materiais[Math.floor(Math.random() * materiais.length)];
        const quantidade = Math.floor(Math.random() * 5) + 1; // 1 a 5 unidades
        const pontos = pontosPorMaterial[material] * quantidade;
        
        // Data aleatória nos últimos 30 dias
        const diasAtras = Math.floor(Math.random() * 30);
        const dataRegistro = new Date();
        dataRegistro.setDate(dataRegistro.getDate() - diasAtras);

        await pool.query(
          `INSERT INTO recycling_records (user_id, tipo_material, quantidade, pontos_gerados, data_registro)
           VALUES ($1, $2, $3, $4, $5)`,
          [alunosIds[i], material, quantidade, pontos, dataRegistro]
        );
        totalRegistros++;
      }
    }
    console.log(`✅ ${totalRegistros} registros de reciclagem criados\n`);

    // Buscar quizzes disponíveis
    const quizzesResult = await pool.query('SELECT id FROM quizzes');
    const quizIds = quizzesResult.rows.map(row => row.id);

    // Criar respostas de quiz
    console.log('❓ Criando respostas de quiz...');
    let respostasCorretas = 0;
    let respostasIncorretas = 0;

    for (let i = 0; i < alunosIds.length; i++) {
      // Cada aluno responde alguns quizzes aleatoriamente
      const numQuizzes = Math.floor(Math.random() * quizIds.length) + 1;
      const quizzesRespondidos = quizIds.slice(0, numQuizzes);

      for (const quizId of quizzesRespondidos) {
        // Buscar quiz para pegar resposta correta
        const quizResult = await pool.query('SELECT resposta_correta FROM quizzes WHERE id = $1', [quizId]);
        const respostaCorreta = quizResult.rows[0].resposta_correta;
        
        // 70% de chance de acertar
        const acertou = Math.random() < 0.7;
        const respostaUsuario = acertou ? respostaCorreta : 'Resposta Errada';

        await pool.query(
          `INSERT INTO quiz_answers (user_id, quiz_id, resposta_usuario, correta)
           VALUES ($1, $2, $3, $4)`,
          [alunosIds[i], quizId, respostaUsuario, acertou]
        );

        if (acertou) {
          respostasCorretas++;
          // Adicionar pontos do quiz
          const scoreResult = await pool.query('SELECT pontos_totais FROM scores WHERE user_id = $1', [alunosIds[i]]);
          const pontosAtuais = scoreResult.rows[0].pontos_totais;
          await pool.query(
            'UPDATE scores SET pontos_totais = $1 WHERE user_id = $2',
            [pontosAtuais + 50, alunosIds[i]]
          );
        } else {
          respostasIncorretas++;
        }
      }
    }
    console.log(`✅ ${respostasCorretas + respostasIncorretas} respostas de quiz criadas (${respostasCorretas} corretas, ${respostasIncorretas} incorretas)\n`);

    // Atualizar níveis baseado nos pontos finais
    console.log('🔄 Atualizando níveis finais...');
    const scoresResult = await pool.query('SELECT user_id, pontos_totais FROM scores');
    
    for (const score of scoresResult.rows) {
      let nivel = 'iniciante';
      if (score.pontos_totais >= 601) nivel = 'agente verde';
      else if (score.pontos_totais >= 301) nivel = 'sustentável';
      else if (score.pontos_totais >= 101) nivel = 'consciente';

      await pool.query(
        'UPDATE scores SET nivel = $1 WHERE user_id = $2',
        [nivel, score.user_id]
      );
    }
    console.log('✅ Níveis atualizados\n');

    // Estatísticas finais
    console.log('📊 Estatísticas do seed:');
    const stats = await pool.query(`
      SELECT 
        (SELECT COUNT(*) FROM users WHERE tipo = 'aluno') as total_alunos,
        (SELECT COUNT(*) FROM users WHERE tipo = 'professor') as total_professores,
        (SELECT COUNT(*) FROM recycling_records) as total_registros,
        (SELECT SUM(pontos_totais) FROM scores) as total_pontos
    `);
    
    console.log(`   👨‍🎓 Alunos: ${stats.rows[0].total_alunos}`);
    console.log(`   👨‍🏫 Professores: ${stats.rows[0].total_professores}`);
    console.log(`   ♻️ Registros de reciclagem: ${stats.rows[0].total_registros}`);
    console.log(`   ⭐ Total de pontos: ${stats.rows[0].total_pontos || 0}`);
    console.log('\n✅ Seed do banco de dados concluído com sucesso!');
    console.log('\n🔑 Credenciais de teste:');
    console.log('   Email: qualquer email dos alunos criados');
    console.log('   Senha: 123456');
    console.log('\n💡 Exemplos de login:');
    console.log('   - ana.costa@teste.com / 123456');
    console.log('   - maria.silva@escola.com / 123456 (professor)');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Erro ao fazer seed do banco:', error);
    process.exit(1);
  }
};

seedDatabase();
