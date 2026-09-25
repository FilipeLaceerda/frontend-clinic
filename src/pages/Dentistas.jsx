import { listar } from '../services/dentistaService';
import Listagem from '../components/Listagem';

const colunas = [
  { campo: 'nome', titulo: 'Nome' },
  { campo: '_id', titulo: 'CPF' },
  { campo: 'CRO', titulo: 'CRO' },
  { campo: 'croUF', titulo: 'UF' },
  { campo: 'especialidade', titulo: 'Especialidade' },
];

export default function Dentistas() {
  return <Listagem titulo="Dentistas" descricao="Profissionais e especialidades da clínica." carregar={listar} colunas={colunas} />;
}
