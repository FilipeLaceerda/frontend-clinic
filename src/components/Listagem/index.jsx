import { useEffect, useState } from 'react';
import Header from '../Header';
import CampoBusca from '../CampoBusca';
import Tabela from '../Tabela';
import './estilo.css';

export default function Listagem({ titulo, descricao, carregar, colunas }) {
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
      .then((lista) => { if (!controller.signal.aborted) setDados(lista); })
      .catch((error) => { if (!controller.signal.aborted) setErro(error.response?.data?.error || error.response?.data?.mensagem || error.response?.data?.message || 'Não foi possível carregar os dados. Verifique o backend e tente novamente.'); })
      .finally(() => { if (!controller.signal.aborted) setCarregando(false); });
    return () => controller.abort();
  }, [carregar, tentativa]);

  const normalizar = (valor) => String(valor ?? '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
  const filtrados = dados.filter((item) => colunas.some((coluna) =>
    normalizar(coluna.formatar ? coluna.formatar(item[coluna.campo]) : item[coluna.campo]).includes(normalizar(busca.trim())),
  ));

  return (
    <section>
      <Header titulo={titulo} descricao={descricao} />
      <div className="card">
        <div className="toolbar">
          <CampoBusca
            rotulo="Buscar na lista"
            placeholder="Digite para buscar…"
            value={busca}
            onChange={(event) => setBusca(event.target.value)}
          />
          {!carregando && !erro && <span role="status">{filtrados.length} registro(s)</span>}
        </div>
        {carregando ? <p className="notice" role="status">Carregando dados…</p> : erro ? (
          <div className="notice" role="alert"><p>{erro}</p><button onClick={() => setTentativa((valor) => valor + 1)}>Tentar novamente</button></div>
        ) : filtrados.length === 0 ? <p className="notice" role="status">Nenhum registro encontrado.</p> : (
          <Tabela titulo={titulo} colunas={colunas} dados={filtrados} />
        )}
      </div>
    </section>
  );
}
