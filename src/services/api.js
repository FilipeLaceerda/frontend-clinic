import atendimentos from '../data/atendimento.json';
import dentistas from '../data/dentista.json';
import procedimentos from '../data/procedimento.json';
import secretarias from '../data/secretaria.json';

export const useApi = import.meta.env.VITE_USE_API === 'true';
const baseUrl = (import.meta.env.VITE_API_URL || '/api').replace(/\/$/, '');
const dadosLocais = { atendimentos, dentistas, procedimentos, secretaria: secretarias };

export async function listar(recurso, signal) {
  if (!useApi) return dadosLocais[recurso];
  const response = await fetch(`${baseUrl}/${recurso}`, { signal });
  // O backend retorna 404 quando a lista de dentistas está vazia.
  if (recurso === 'dentistas' && response.status === 404) return [];
  if (!response.ok) throw new Error('Não foi possível carregar os dados. Verifique o backend e tente novamente.');
  const body = await response.json();
  const dados = Array.isArray(body) ? body : body.data;
  if (!Array.isArray(dados)) throw new Error('A API retornou uma lista em formato inesperado.');
  return dados;
}

export function moeda(valor) {
  return valor == null ? '—' : Number(valor).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

export function dataBR(valor) {
  return valor ? valor.split('-').reverse().join('/') : '—';
}
