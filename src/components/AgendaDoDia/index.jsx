import { useCallback, useState } from 'react';
import CabecalhoComAcao from '../CabecalhoComAcao';
import CampoFormulario from '../CampoFormulario';
import CampoInput from '../CampoInput';
import Listagem from '../Listagem/index';
import { listar } from '../../services/atendimentoService';
import { dataBR } from '../../utils/formatadores';

function dataDeHoje() {
  const hoje = new Date();
  const ano = hoje.getFullYear();
  const mes = String(hoje.getMonth() + 1).padStart(2, '0');
  const dia = String(hoje.getDate()).padStart(2, '0');

  return `${ano}-${mes}-${dia}`;
}

function statusLegivel(status) {
  return (
    {
      AGENDADO: 'Agendado',
      CANCELADO: 'Cancelado',
      CONCLUIDO: 'Concluído',
      CONCLUÍDO: 'Concluído',
    }[status] || status || '—'
  );
}

function horario(valor) {
  return valor ? valor.slice(0, 5) : '—';
}

function dataISO(valor) {
  return String(valor ?? '').slice(0, 10);
}

const colunas = [
  {
    campo: 'horario_inicio',
    titulo: 'Horário',
    renderizar: (atendimento) => (
      <>
        {horario(atendimento.horario_inicio)}–{horario(atendimento.horario_fim)}
      </>
    ),
  },
  {
    campo: 'idAtendimento',
    titulo: 'Atendimento',
    formatar: (valor) => `#${valor}`,
  },
  { campo: 'fk_CPF_Paciente', titulo: 'CPF do paciente' },
  {
    campo: 'secretaria',
    titulo: 'Secretária',
    renderizar: (atendimento) => atendimento.secretaria?.nome || 'Não vinculada',
  },
  { campo: 'status', titulo: 'Status', formatar: statusLegivel },
  { campo: 'observacao', titulo: 'Observação' },
];

export default function AgendaDoDia() {
  const [dataSelecionada, setDataSelecionada] = useState(dataDeHoje);

  const carregarAgenda = useCallback(
    async (_, signal) => {
      const atendimentos = await listar({}, signal);

      return atendimentos
        .filter((atendimento) => dataISO(atendimento.data) === dataSelecionada)
        .sort((primeiro, segundo) =>
          String(primeiro.horario_inicio).localeCompare(
            String(segundo.horario_inicio),
          ),
        );
    },
    [dataSelecionada],
  );

  return (
    <section>
      <CabecalhoComAcao
        titulo="Agenda"
        descricao={`Atendimentos agendados para ${dataBR(dataSelecionada)}.`}
        acao={
          <CampoFormulario rotulo="Data da agenda">
            <CampoInput
              type="date"
              value={dataSelecionada}
              onChange={(event) => setDataSelecionada(event.target.value)}
            />
          </CampoFormulario>
        }
      />
      <Listagem
        tituloTabela="Agenda do dia"
        carregar={carregarAgenda}
        colunas={colunas}
        rotuloBusca="Buscar na agenda"
        placeholderBusca="Atendimento, CPF, secretária, status ou observação"
        buscarEm={(atendimento) => [
          atendimento.idAtendimento,
          atendimento.fk_CPF_Paciente,
          atendimento.secretaria?.nome,
          atendimento.status,
          atendimento.observacao,
        ]}
        mensagemVazio={`Nenhum atendimento para ${dataBR(dataSelecionada)}.`}
      />
    </section>
  );
}
