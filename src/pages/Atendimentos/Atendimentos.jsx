import { useNavigate } from 'react-router-dom';
import AcoesTabela from '../../components/AcoesTabela';
import Botao from '../../components/Botao';
import CabecalhoComAcao from '../../components/CabecalhoComAcao';
import Listagem from '../../components/Listagem';
import Pagina from '../../components/Pagina';
import { listar } from '../../services/atendimentoService';
import { dataBR } from '../../utils/formatadores';
import './Atendimentos.css';

const statusLegivel = (valor) =>
  ({
    AGENDADO: 'Agendado',
    CANCELADO: 'Cancelado',
    CONCLUIDO: 'Concluído',
    CONCLUÍDO: 'Concluído',
  })[valor] || valor || '—';

const horario = (valor) => (valor ? valor.slice(0, 5) : '—');

export default function Atendimentos() {
  const navigate = useNavigate();

  function abrirRota(atendimento, sufixo = '') {
    if (!atendimento._id) return;
    navigate(`/atendimentos/${atendimento._id}${sufixo}`);
  }

  const colunas = [
    {
      campo: 'idAtendimento',
      titulo: 'Número',
      formatar: (valor) => `#${valor}`,
    },
    {
      campo: 'data',
      titulo: 'Data e horário',
      renderizar: (atendimento) => (
        <>
          {dataBR(atendimento.data)} · {horario(atendimento.horario_inicio)}–
          {horario(atendimento.horario_fim)}
        </>
      ),
    },
    { campo: 'fk_CPF_Paciente', titulo: 'CPF do paciente' },
    { campo: 'status', titulo: 'Status', formatar: statusLegivel },
  ];

  return (
    <Pagina className="pagina-atendimentos">
      <CabecalhoComAcao
        titulo="Atendimentos"
        descricao="Consulte os horários e as informações dos atendimentos."
        acao={
          <Botao
            onClick={() => navigate('/atendimentos/novo')}
          >
            Cadastrar atendimento
          </Botao>
        }
      />
      <Listagem
        tituloTabela="Atendimentos"
        carregar={listar}
        colunas={colunas}
        renderAcoes={(atendimento) => (
          <div className="table-actions">
            <AcoesTabela
              item={atendimento}
              onVisualizar={() => abrirRota(atendimento)}
              onEditar={() => abrirRota(atendimento, '/editar')}
            />
          </div>
        )}
        rotuloBusca="Buscar atendimento"
        placeholderBusca="Número, CPF, status ou observação"
        buscarEm={(atendimento) => [
          atendimento.idAtendimento,
          atendimento.fk_CPF_Paciente,
          atendimento.observacao,
          statusLegivel(atendimento.status),
        ]}
      />
    </Pagina>
  );
}
