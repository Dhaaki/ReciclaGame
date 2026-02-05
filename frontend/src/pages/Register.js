import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../services/api';
import './Register.css';

const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    senha: '',
    tipo: 'aluno',
    turma: '',
    idade: '',
    sexo: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      await api.post('/users/register', formData);
      setSuccess('Cadastro realizado com sucesso! Redirecionando...');
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } catch (err) {
      console.error('Erro completo no cadastro:', err);
      console.error('URL da requisição:', err.config?.url);
      console.error('Base URL:', err.config?.baseURL);
      
      let errorMessage = 'Erro ao cadastrar';
      
      if (err.response) {
        // Erro com resposta do servidor
        errorMessage = err.response.data?.error || `Erro ${err.response.status}: ${err.response.statusText}`;
      } else if (err.request) {
        // Erro de conexão (servidor não respondeu)
        errorMessage = 'Não foi possível conectar ao servidor. Verifique se o back-end está rodando na porta 3001.';
      } else {
        // Outro tipo de erro
        errorMessage = err.message || 'Erro ao cadastrar';
      }
      
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-page">
      <div className="register-container">
        <div className="register-card">
          <h1>🌱 Reciclagem Game</h1>
          <h2>Cadastro</h2>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Nome</label>
              <input
                type="text"
                name="nome"
                value={formData.nome}
                onChange={handleChange}
                required
                placeholder="Seu nome completo"
              />
            </div>
            <div className="form-group">
              <label>Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                placeholder="seu@email.com"
              />
            </div>
            <div className="form-group">
              <label>Senha</label>
              <input
                type="password"
                name="senha"
                value={formData.senha}
                onChange={handleChange}
                required
                placeholder="••••••••"
                minLength="6"
              />
            </div>
            <div className="form-group">
              <label>Tipo de Usuário</label>
              <select name="tipo" value={formData.tipo} onChange={handleChange} required>
                <option value="aluno">Aluno</option>
                <option value="professor">Professor</option>
              </select>
            </div>
            {formData.tipo === 'aluno' && (
              <>
                <div className="form-group">
                  <label>Turma</label>
                  <input
                    type="text"
                    name="turma"
                    value={formData.turma}
                    onChange={handleChange}
                    placeholder="Ex: 5º Ano A, 6º Ano B"
                  />
                </div>
                <div className="form-group">
                  <label>Idade</label>
                  <input
                    type="number"
                    name="idade"
                    value={formData.idade}
                    onChange={handleChange}
                    min="5"
                    max="18"
                    placeholder="Sua idade"
                  />
                </div>
                <div className="form-group">
                  <label>Sexo</label>
                  <select name="sexo" value={formData.sexo} onChange={handleChange}>
                    <option value="">Selecione</option>
                    <option value="Masculino">Masculino</option>
                    <option value="Feminino">Feminino</option>
                    <option value="Outro">Outro</option>
                    <option value="Prefiro não informar">Prefiro não informar</option>
                  </select>
                </div>
              </>
            )}
            {error && <div className="error">{error}</div>}
            {success && <div className="success">{success}</div>}
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? 'Cadastrando...' : 'Cadastrar'}
            </button>
          </form>
          <p className="login-link">
            Já tem uma conta? <Link to="/login">Faça login</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
