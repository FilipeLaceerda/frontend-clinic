import api from './api';

export async function listar(params = {}, signal) {
  try {
    const { data } = await api.get('/dentistas', { params, signal });
    return data;
  } catch (error) {
    // Esta rota retorna 404 quando nenhum dentista é encontrado.
    if (error.response?.status === 404 && error.response.data?.message === 'Nenhum dentista encontrado com esse nome') return [];
    throw error;
  }
}

export async function buscarPorCpf(cpf, signal) {
  const { data } = await api.get(`/dentistas/${encodeURIComponent(cpf)}`, { signal });
  return data;
}

export async function criar(dados) {
  const { data } = await api.post('/dentistas', dados);
  return data;
}

export async function atualizar(cpf, dados) {
  const { data } = await api.put(`/dentistas/${encodeURIComponent(cpf)}`, dados);
  return data;
}

export async function excluir(cpf) {
  await api.delete(`/dentistas/${encodeURIComponent(cpf)}`);
}
