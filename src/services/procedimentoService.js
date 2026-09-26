import api from './api';

export async function listar(params = {}, signal) {
  const { data } = await api.get('/procedimentos', { params, signal });
  return data;
}

export async function buscarPorId(id, signal) {
  const { data } = await api.get(`/procedimentos/${encodeURIComponent(id)}`, { signal });
  return data;
}

export async function criar(dados) {
  const { data } = await api.post('/procedimentos', dados);
  return data.procedimento;
}

export async function atualizar(id, dados) {
  const { data } = await api.patch(`/procedimentos/${encodeURIComponent(id)}`, dados);
  return data.procedimento;
}

export async function excluir(id) {
  await api.delete(`/procedimentos/${encodeURIComponent(id)}`);
}
