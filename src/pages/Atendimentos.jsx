import Listagem from '../components/Listagem';
import { dataBR, moeda } from '../services/api';

const colunas = [
  { campo: 'idAtendimento', titulo: 'Número' },
  { campo: 'data', titulo: 'Data', formatar: dataBR },
  { campo: 'horario_inicio', titulo: 'Início' },
  { campo: 'horario_fim', titulo: 'Fim' },
  { campo: 'fk_CPF_Paciente', titulo: 'CPF do paciente' },
  { campo: 'fk_CPF_Secretaria', titulo: 'CPF da secretária' },
  { campo: 'tipoAtendimento', titulo: 'Tipo' },
  { campo: 'status', titulo: 'Status', formatar: (valor) => ({ AGENDADO: 'Agendado', CANCELADO: 'Cancelado', CONCLUIDO: 'Concluído', 'CONCLUÍDO': 'Concluído' }[valor] || valor || '—') },
  { campo: 'valorTotal', titulo: 'Valor total', formatar: moeda },
  { campo: 'parcelas', titulo: 'Parcelas' },
  { campo: 'observacao', titulo: 'Observação' },
];

export default function Atendimentos() {
  return <Listagem titulo="Atendimentos" descricao="Consulte os horários e as informações dos atendimentos." recurso="atendimentos" colunas={colunas} />;
}
