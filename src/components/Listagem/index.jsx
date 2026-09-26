import { useEffect, useState } from 'react';
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
  carregar,
  colunas,
  tituloTabela = 'Lista',
  rotuloBusca = 'Buscar na lista',
  placeholderBusca = 'Digite para buscar…',
  buscarEm,
  filtrarDados,
  mensagemVazio = 'Nenhum registro encontrado.',
  atualizacao = 0,
  renderAcoes,
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
  }, [carregar, tentativa, atualizacao]);

  const colunasTabela = renderAcoes
    ? [
        ...colunas,
        {
          campo: 'acoes',
          titulo: 'Ações',
          renderizar: renderAcoes,
        },
      ]
    : colunas;
  const dadosFiltrados = filtrarDados ? filtrarDados(dados) : dados;

  const filtrados = dadosFiltrados.filter((item) => {
    const valores = buscarEm
      ? buscarEm(item)
      : colunasTabela
        .filter((coluna) => !coluna.renderizar)
        .map((coluna) => coluna.formatar ? coluna.formatar(item[coluna.campo]) : item[coluna.campo]);

    return valores.some((valor) => normalizar(valor).includes(normalizar(busca.trim())));
  });

  return (
    <section className="listagem">
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
          <Tabela
            titulo={tituloTabela}
            colunas={colunasTabela}
            dados={filtrados}
          />
        )}
      </div>
    </section>
  );
}
