import api from './api';

export async function listar(params = {}, signal) {
  const { data } = await api.get('/atendimentos', { params, signal });
  return data.data;
}

export async function buscarPorId(id, signal) {
  const { data } = await api.get(`/atendimentos/${encodeURIComponent(id)}`, { signal });
  return data.data;
}

export async function criar(dados) {
  const { data } = await api.post('/atendimentos', dados);
  return data.data;
}

export async function atualizar(id, dados) {
  const { data } = await api.patch(`/atendimentos/${encodeURIComponent(id)}`, dados);
  return data.data;
}

export async function excluir(id) {
  await api.delete(`/atendimentos/${encodeURIComponent(id)}`);
}
