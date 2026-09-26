import { useState } from 'react';
import CabecalhoComAcao from '../CabecalhoComAcao';
import CampoFormulario from '../CampoFormulario';
import CampoInput from '../CampoInput';
import Listagem from '../Listagem';
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
  { campo: 'status', titulo: 'Status', formatar: statusLegivel },
  { campo: 'observacao', titulo: 'Observação' },
];

export default function AgendaDoDia() {
  const [dataSelecionada, setDataSelecionada] = useState(dataDeHoje);

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
        titulo="Agenda do dia"
        descricao=""
        carregar={listar}
        colunas={colunas}
        mostrarCabecalho={false}
        rotuloBusca="Buscar na agenda"
        placeholderBusca="Atendimento, CPF, status ou observação"
        buscarEm={(atendimento) => [
          atendimento.idAtendimento,
          atendimento.fk_CPF_Paciente,
          atendimento.status,
          atendimento.observacao,
        ]}
        filtrarDados={(atendimentos) =>
          atendimentos
            .filter((atendimento) => atendimento.data === dataSelecionada)
            .sort((primeiro, segundo) =>
              primeiro.horario_inicio.localeCompare(segundo.horario_inicio),
            )
        }
        mensagemVazio={`Nenhum atendimento para ${dataBR(dataSelecionada)}.`}
      />
    </section>
  );
}
