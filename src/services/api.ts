import axios from 'axios';

// A URL do backend 
const API_BASE_URL = 'http://localhost:5257/api';

// Cria a instância do axios
const apiClient = axios.create({
  baseURL: API_BASE_URL,
});

/**
 * Envia um arquivo XML de NF-e para o backend.
 * @param file O arquivo XML a ser enviado.
 * @returns A NF-e processada.
 */
export const uploadNfe = (file: File) => {
  // O FormData é a forma correta de enviar arquivos via HTTP
  const formData = new FormData();
  formData.append('file', file, file.name);

  // Envia a requisição para o endpoint /api/Nfe/upload
  return apiClient.post('/Nfe/upload', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};

export const getAllNfes = () => {
  return apiClient.get('/Nfe');
};

export const getNfeStats = () => {
  return apiClient.get('/Nfe/stats');
};