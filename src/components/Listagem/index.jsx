import { useEffect, useState } from 'react';
import Header from '../Header';
import CampoBusca from '../CampoBusca';
import Botao from '../Botao';
import MensagemEstado from '../MensagemEstado';
import Tabela from '../Tabela';
import './estilo.css';

function normalizar(valor) {
  return String(valor ?? '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase();
}

function mensagemDoErro(error) {
  return (
    error.response?.data?.error ||
    error.response?.data?.mensagem ||
    error.response?.data?.message ||
    'Não foi possível carregar os dados. Verifique o backend e tente novamente.'
  );
}

export default function Listagem({
  titulo,
  descricao,
  carregar,
  colunas,
  mostrarCabecalho = true,
  rotuloBusca = 'Buscar na lista',
  placeholderBusca = 'Digite para buscar…',
  buscarEm,
  filtrarDados,
  mensagemVazio = 'Nenhum registro encontrado.',
}) {
  const [dados, setDados] = useState([]);
  const [busca, setBusca] = useState('');
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState('');
  const [tentativa, setTentativa] = useState(0);

  useEffect(() => {
    const controller = new AbortController();
    setCarregando(true);
    setErro('');
    carregar({}, controller.signal)
      .then((lista) => {
        if (!controller.signal.aborted) setDados(lista);
      })
      .catch((error) => {
        if (!controller.signal.aborted) setErro(mensagemDoErro(error));
      })
      .finally(() => {
        if (!controller.signal.aborted) setCarregando(false);
      });
    return () => controller.abort();
  }, [carregar, tentativa]);

  const dadosFiltrados = filtrarDados ? filtrarDados(dados) : dados;

  const filtrados = dadosFiltrados.filter((item) => {
    const valores = buscarEm
      ? buscarEm(item)
      : colunas
        .filter((coluna) => !coluna.renderizar)
        .map((coluna) => coluna.formatar ? coluna.formatar(item[coluna.campo]) : item[coluna.campo]);

    return valores.some((valor) => normalizar(valor).includes(normalizar(busca.trim())));
  });

  return (
    <section className="listagem">
      {mostrarCabecalho && <Header titulo={titulo} descricao={descricao} />}
      <div className="card">
        <div className="toolbar">
          <CampoBusca
            rotulo={rotuloBusca}
            placeholder={placeholderBusca}
            value={busca}
            onChange={(event) => setBusca(event.target.value)}
          />
          {!carregando && !erro && (
            <span role="status">{filtrados.length} registro(s)</span>
          )}
        </div>
        {carregando ? (
          <MensagemEstado>Carregando dados…</MensagemEstado>
        ) : erro ? (
          <MensagemEstado
            tipo="erro"
            acao={
              <Botao onClick={() => setTentativa((valor) => valor + 1)}>
                Tentar novamente
              </Botao>
            }
          >
            {erro}
          </MensagemEstado>
        ) : filtrados.length === 0 ? (
          <MensagemEstado>{mensagemVazio}</MensagemEstado>
        ) : (
          <Tabela titulo={titulo} colunas={colunas} dados={filtrados} />
        )}
      </div>
    </section>
  );
}
