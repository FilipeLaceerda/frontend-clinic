import { useEffect, useState } from 'react';
import { listar } from '../services/api';

export default function Listagem({ titulo, descricao, recurso, colunas }) {
  const [dados, setDados] = useState([]);
  const [busca, setBusca] = useState('');
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState('');
  const [tentativa, setTentativa] = useState(0);

  useEffect(() => {
    const controller = new AbortController();
    setCarregando(true);
    setErro('');
    listar(recurso, controller.signal)
      .then((lista) => { if (!controller.signal.aborted) setDados(lista); })
      .catch((error) => { if (!controller.signal.aborted) setErro(error.message); })
      .finally(() => { if (!controller.signal.aborted) setCarregando(false); });
    return () => controller.abort();
  }, [recurso, tentativa]);

  const normalizar = (valor) => String(valor ?? '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
  const filtrados = dados.filter((item) => colunas.some((coluna) =>
    normalizar(coluna.formatar ? coluna.formatar(item[coluna.campo]) : item[coluna.campo]).includes(normalizar(busca.trim())),
  ));

  return (
    <section>
      <header><span className="eyebrow">PAINEL DA CLÍNICA</span><h1>{titulo}</h1><p>{descricao}</p></header>
      <div className="card">
        <div className="toolbar">
          <label>Buscar na lista<input type="search" placeholder="Digite para buscar…" value={busca} onChange={(event) => setBusca(event.target.value)} /></label>
          {!carregando && !erro && <span role="status">{filtrados.length} registro(s)</span>}
        </div>
        {carregando ? <p className="notice" role="status">Carregando dados…</p> : erro ? (
          <div className="notice" role="alert"><p>{erro}</p><button onClick={() => setTentativa((valor) => valor + 1)}>Tentar novamente</button></div>
        ) : filtrados.length === 0 ? <p className="notice" role="status">Nenhum registro encontrado.</p> : (
          <div className="table-scroll" tabIndex={0} role="region" aria-label={`Lista de ${titulo.toLowerCase()}`}>
            <table>
              <caption className="sr-only">{titulo}</caption>
              <thead><tr>{colunas.map((coluna) => <th scope="col" key={coluna.campo}>{coluna.titulo}</th>)}</tr></thead>
              <tbody>{filtrados.map((item, index) => (
                <tr key={item._id || item.idAtendimento || item.idProcedimento || item.id || index}>
                  {colunas.map((coluna) => <td key={coluna.campo}>{coluna.formatar ? coluna.formatar(item[coluna.campo]) : (item[coluna.campo] ?? '—')}</td>)}
                </tr>
              ))}</tbody>
            </table>
          </div>
        )}
      </div>
    </section>
  );
}
