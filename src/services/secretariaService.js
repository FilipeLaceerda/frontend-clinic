import api from './api';

export async function listar(params = {}, signal) {
  const { data } = await api.get('/secretaria', { params, signal });
  return data;
}

export async function buscarPorId(id, signal) {
  const { data } = await api.get(`/secretaria/${encodeURIComponent(id)}`, { signal });
  return data;
}

export async function criar(dados) {
  const { data } = await api.post('/secretaria', dados);
  return data.data;
}

export async function atualizar(id, dados) {
  const { data } = await api.patch(`/secretaria/${encodeURIComponent(id)}`, dados);
  return data.data;
}

export async function excluir(id) {
  await api.delete(`/secretaria/${encodeURIComponent(id)}`);
}

export async function buscarPorNome(nome, signal) {
  const { data } = await api.get('/secretaria/buscar', { params: { nome }, signal });
  return data;
}
