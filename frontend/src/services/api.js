import axios from 'axios';

// Garantir que a baseURL sempre tenha /api
let baseURL = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';

// Se não terminar com /api, adicionar
if (!baseURL.endsWith('/api')) {
  baseURL = baseURL.endsWith('/') ? baseURL + 'api' : baseURL + '/api';
}

console.log('🔗 API Base URL configurada:', baseURL);

const api = axios.create({
  baseURL: baseURL,
});

// Interceptor para adicionar token nas requisições
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor para tratar erros de autenticação
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Log detalhado para debug
    if (error.response) {
      console.error('Erro na resposta:', {
        status: error.response.status,
        statusText: error.response.statusText,
        url: error.config?.url,
        baseURL: error.config?.baseURL,
        data: error.response.data
      });
    } else if (error.request) {
      console.error('Erro de conexão - Servidor não respondeu:', {
        url: error.config?.url,
        baseURL: error.config?.baseURL
      });
    } else {
      console.error('Erro na requisição:', error.message);
    }
    
    if (error.response?.status === 401 || error.response?.status === 403) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;
