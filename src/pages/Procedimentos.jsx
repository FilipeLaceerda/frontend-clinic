import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { listar, excluir } from '../services/procedimentoService';
import { moeda } from '../utils/formatadores';

import Botao from '../components/Botao';
import CabecalhoComAcao from '../components/CabecalhoComAcao';
import CampoBusca from '../components/CampoBusca';
import Tabela from '../components/Tabela';
import AcoesTabela from '../components/AcoesTabela';
import ConfirmacaoExclusao from '../components/ConfirmacaoExclusao';
import MensagemEstado from '../components/MensagemEstado';
import Pagina from '../components/Pagina';

export default function Procedimentos() {
  const navigate = useNavigate();
  const [procedimentos, setProcedimentos] = useState([]);
  const [busca, setBusca] = useState('');
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState('');
  const [processandoId, setProcessandoId] = useState(null);
  const [procedimentoParaExcluir, setProcedimentoParaExcluir] = useState(null);
  const [erroExclusao, setErroExclusao] = useState('');

  function abrirEdicao(procedimento) {
    if (processandoId !== null || !procedimento._id) return;
    navigate(`/procedimentos/${procedimento._id}/editar`);
  }

  async function handleExcluir() {
    const procedimento = procedimentoParaExcluir;
    if (processandoId !== null || !procedimento?._id) return;
    setErroExclusao('');

    try {
      setProcessandoId(procedimento._id);
      await excluir(procedimento._id);
      setProcedimentos((lista) =>
        lista.filter((item) => item._id !== procedimento._id),
      );
      setProcedimentoParaExcluir(null);
    } catch (error) {
      setErroExclusao(
        error.response?.data?.error ||
          error.response?.data?.mensagem ||
          error.response?.data?.message ||
          'Não foi possível excluir o procedimento.',
      );
    } finally {
      setProcessandoId(null);
    }
  }

  const colunas = [
    { campo: 'nome', titulo: 'Nome' },
    { campo: 'descricao', titulo: 'Descrição' },
    { campo: 'tipoProcedimento', titulo: 'Tipo' },
    { campo: 'valor', titulo: 'Valor', formatar: moeda },
    {
      campo: 'acoes',
      titulo: 'Ações',
      renderizar: (procedimento) => (
        <div className="table-actions">
          <AcoesTabela
            item={procedimento}
            onEditar={() => abrirEdicao(procedimento)}
            onExcluir={() => {
              setErroExclusao('');
              setProcedimentoParaExcluir(procedimento);
            }}
            processandoId={processandoId}
            disabled={processandoId !== null || !procedimento._id}
          />
        </div>
      ),
    },
  ];

  useEffect(() => {
    const controller = new AbortController();
    setCarregando(true);
    setErro('');

    listar({}, controller.signal)
      .then((lista) => {
        if (!controller.signal.aborted) setProcedimentos(lista);
      })
      .catch((error) => {
        if (!controller.signal.aborted) {
          setErro(
            error.response?.data?.error ||
              error.response?.data?.mensagem ||
              error.response?.data?.message ||
              'Não foi possível carregar os procedimentos.',
          );
        }
      })
      .finally(() => {
        if (!controller.signal.aborted) setCarregando(false);
      });

    return () => controller.abort();
  }, []);

  const procedimentosFiltrados = procedimentos.filter((procedimento) =>
    String(procedimento.nome ?? '')
      .toLowerCase()
      .includes(busca.toLowerCase())
  );

  return (
    <Pagina>
      <CabecalhoComAcao
        titulo="Procedimentos"
        descricao="Consulte os procedimentos oferecidos e seus valores."
        acao={
          <Botao onClick={() => navigate('/procedimentos/novo')}>
            Cadastrar procedimento
          </Botao>
        }
      />

      <div className="card">
        <div className="toolbar">
          <CampoBusca
            rotulo="Buscar procedimentos"
            placeholder="Digite para buscar…"
            value={busca}
            onChange={(event) => setBusca(event.target.value)}
          />
        </div>

        {carregando ? (
          <MensagemEstado>Carregando dados…</MensagemEstado>
        ) : erro ? (
          <MensagemEstado tipo="erro">{erro}</MensagemEstado>
        ) : (
          <Tabela
            titulo="Procedimentos"
            colunas={colunas}
            dados={procedimentosFiltrados}
          />
        )}
      </div>
      {procedimentoParaExcluir && (
        <ConfirmacaoExclusao
          nomeItem={procedimentoParaExcluir.nome || 'este procedimento'}
          processando={processandoId !== null}
          erro={erroExclusao}
          onCancelar={() => setProcedimentoParaExcluir(null)}
          onConfirmar={handleExcluir}
        />
      )}
    </Pagina>
  );
}
