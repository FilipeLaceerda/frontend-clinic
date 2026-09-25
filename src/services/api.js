import axios from 'axios';
import atendimentos from '../data/atendimento.json';
import dentistas from '../data/dentista.json';
import procedimentos from '../data/procedimento.json';
import secretarias from '../data/secretaria.json';

export const useApi = import.meta.env.VITE_USE_API === 'true';
const baseUrl = (import.meta.env.VITE_API_URL || '/api').replace(/\/$/, '');

const dadosLocais = {
  atendimentos,
  dentistas,
  procedimentos,
  secretaria: secretarias,
};

const api = axios.create({
  baseURL: baseUrl,
  headers: {
    'Content-Type': 'application/json',
  },
});

export async function listar(recurso, signal) {
  if (!useApi) {
    return dadosLocais[recurso] ?? [];
  }

  try {
    const response = await api.get(`/${recurso}`, { signal });
    const body = response.data;
    const dados = Array.isArray(body) ? body : body.data;

    if (!Array.isArray(dados)) {
      throw new Error('A API retornou uma lista em formato inesperado.');
    }

    return dados;
  } catch (error) {
    if (recurso === 'dentistas' && error.response?.status === 404) {
      return [];
    }

    if (axios.isCancel(error) || error.name === 'CanceledError') {
      throw error;
    }

    throw new Error('Não foi possível carregar os dados. Verifique o backend e tente novamente.');
  }
}

export async function criar(recurso, dados) {
  const response = await api.post(`/${recurso}`, dados);
  return response.data;
}

export async function atualizar(recurso, id, dados) {
  const response = await api.put(`/${recurso}/${encodeURIComponent(id)}`, dados);
  return response.data;
}

export async function remover(recurso, id) {
  await api.delete(`/${recurso}/${encodeURIComponent(id)}`);
}

export function moeda(valor) {
  return valor == null ? '—' : Number(valor).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

export function dataBR(valor) {
  return valor ? valor.split('-').reverse().join('/') : '—';
}
