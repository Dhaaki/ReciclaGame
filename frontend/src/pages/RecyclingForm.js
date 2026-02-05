import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import './RecyclingForm.css';

const RecyclingForm = ({ user, setUser }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    tipo_material: '',
    quantidade: 1
  });
  const [foto, setFoto] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    setFoto(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      const formDataToSend = new FormData();
      formDataToSend.append('user_id', user.id);
      formDataToSend.append('tipo_material', formData.tipo_material);
      formDataToSend.append('quantidade', formData.quantidade);
      if (foto) {
        formDataToSend.append('foto', foto);
      }

      const response = await api.post('/recycling-records', formDataToSend, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      setSuccess(`Registro criado! Você ganhou ${response.data.record.pontos_gerados} pontos!`);
      
      // Atualizar user
      setUser({
        ...user,
        pontos_totais: response.data.pontos_totais,
        nivel: response.data.nivel
      });

      setTimeout(() => {
        navigate('/dashboard');
      }, 2000);
    } catch (err) {
      setError(err.response?.data?.error || 'Erro ao registrar reciclagem');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="recycling-form-page">
      <div className="container">
        <div className="recycling-form-card">
          <h1>♻️ Registrar Reciclagem</h1>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Tipo de Material</label>
              <select
                name="tipo_material"
                value={formData.tipo_material}
                onChange={handleChange}
                required
              >
                <option value="">Selecione o material</option>
                <option value="papel">Papel (10 pontos/unidade)</option>
                <option value="plástico">Plástico (15 pontos/unidade)</option>
                <option value="metal">Metal (20 pontos/unidade)</option>
                <option value="vidro">Vidro (25 pontos/unidade)</option>
              </select>
            </div>

            <div className="form-group">
              <label>Quantidade</label>
              <input
                type="number"
                name="quantidade"
                value={formData.quantidade}
                onChange={handleChange}
                required
                min="1"
                placeholder="Quantidade de unidades"
              />
            </div>

            <div className="form-group">
              <label>Foto (Opcional)</label>
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
              />
              <small>Formatos aceitos: JPG, PNG, GIF (máx. 5MB)</small>
            </div>

            {error && <div className="error">{error}</div>}
            {success && <div className="success">{success}</div>}

            <div className="form-actions">
              <button type="submit" className="btn btn-primary" disabled={loading}>
                {loading ? 'Registrando...' : 'Registrar Reciclagem'}
              </button>
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => navigate('/dashboard')}
              >
                Cancelar
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default RecyclingForm;
