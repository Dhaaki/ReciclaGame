require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Servir arquivos estáticos (imagens)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Rotas
const userRoutes = require('./src/routes/userRoutes');
const recyclingRoutes = require('./src/routes/recyclingRoutes');
const quizRoutes = require('./src/routes/quizRoutes');
const rankingRoutes = require('./src/routes/rankingRoutes');
const scoreRoutes = require('./src/routes/scoreRoutes');
const analyticsRoutes = require('./src/routes/analyticsRoutes');

app.use('/api/users', userRoutes);
app.use('/api/recycling-records', recyclingRoutes);
app.use('/api/quizzes', quizRoutes);
app.use('/api/ranking', rankingRoutes);
app.use('/api/scores', scoreRoutes);
app.use('/api/analytics', analyticsRoutes);

// Rota de teste
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'API funcionando!' });
});

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando na porta ${PORT}`);
});
