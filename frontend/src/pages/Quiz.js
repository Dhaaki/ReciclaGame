import React, { useState, useEffect } from 'react';
import api from '../services/api';
import './Quiz.css';

const Quiz = ({ user, setUser }) => {
  const [quizzes, setQuizzes] = useState([]);
  const [currentQuizIndex, setCurrentQuizIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState('');
  const [answeredQuizzes, setAnsweredQuizzes] = useState([]);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchQuizzes();
  }, []);

  const fetchQuizzes = async () => {
    try {
      const response = await api.get('/quizzes');
      setQuizzes(response.data);
      
      // Buscar quizzes já respondidos
      const answeredResponse = await api.get(`/recycling-records/user/${user.id}`);
      // Nota: Esta é uma simplificação. Em produção, seria melhor ter um endpoint específico
    } catch (error) {
      console.error('Erro ao buscar quizzes:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAnswer = async () => {
    if (!selectedAnswer) return;

    setSubmitting(true);
    try {
      const currentQuiz = quizzes[currentQuizIndex];
      const response = await api.post('/quizzes/answer', {
        user_id: user.id,
        quiz_id: currentQuiz.id,
        resposta_usuario: selectedAnswer
      });

      setResult(response.data);
      setAnsweredQuizzes([...answeredQuizzes, currentQuiz.id]);

      // Atualizar user se ganhou pontos
      if (response.data.correta && response.data.pontos_adicionados > 0) {
        setUser({
          ...user,
          pontos_totais: (user.pontos_totais || 0) + response.data.pontos_adicionados
        });
      }
    } catch (error) {
      console.error('Erro ao responder quiz:', error);
      if (error.response?.data?.error) {
        setResult({ error: error.response.data.error });
      }
    } finally {
      setSubmitting(false);
    }
  };

  const handleNext = () => {
    setCurrentQuizIndex(currentQuizIndex + 1);
    setSelectedAnswer('');
    setResult(null);
  };

  if (loading) {
    return <div className="container"><div className="loading">Carregando quizzes...</div></div>;
  }

  if (quizzes.length === 0) {
    return <div className="container"><div className="error">Nenhum quiz disponível</div></div>;
  }

  const currentQuiz = quizzes[currentQuizIndex];
  const isAnswered = answeredQuizzes.includes(currentQuiz.id);
  const hasMore = currentQuizIndex < quizzes.length - 1;

  return (
    <div className="quiz-page">
      <div className="container">
        <div className="quiz-card">
          <div className="quiz-header">
            <h1>❓ Quiz Educativo</h1>
            <p className="quiz-progress">
              Pergunta {currentQuizIndex + 1} de {quizzes.length}
            </p>
          </div>

          {result?.error ? (
            <div className="error">{result.error}</div>
          ) : (
            <>
              <div className="quiz-question">
                <h2>{currentQuiz.pergunta}</h2>
              </div>

              <div className="quiz-answers">
                {currentQuiz.alternativas.map((alt, index) => (
                  <button
                    key={index}
                    className={`answer-button ${selectedAnswer === alt ? 'selected' : ''} ${isAnswered && alt === currentQuiz.resposta_correta ? 'correct' : ''} ${isAnswered && selectedAnswer === alt && alt !== currentQuiz.resposta_correta ? 'wrong' : ''}`}
                    onClick={() => !isAnswered && setSelectedAnswer(alt)}
                    disabled={isAnswered}
                  >
                    {alt}
                  </button>
                ))}
              </div>

              {result && (
                <div className={`quiz-result ${result.correta ? 'success' : 'error'}`}>
                  <h3>{result.correta ? '✅ Correto!' : '❌ Incorreto'}</h3>
                  <p>{result.mensagem}</p>
                  {result.pontos_adicionados > 0 && (
                    <p className="points-earned">+{result.pontos_adicionados} pontos!</p>
                  )}
                </div>
              )}

              <div className="quiz-actions">
                {!isAnswered && !result && (
                  <button
                    className="btn btn-primary"
                    onClick={handleAnswer}
                    disabled={!selectedAnswer || submitting}
                  >
                    {submitting ? 'Enviando...' : 'Responder'}
                  </button>
                )}
                {result && hasMore && (
                  <button className="btn btn-primary" onClick={handleNext}>
                    Próxima Pergunta
                  </button>
                )}
                {result && !hasMore && (
                  <div className="quiz-complete">
                    <p>🎉 Você completou todos os quizzes!</p>
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Quiz;
