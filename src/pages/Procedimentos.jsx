import { listar } from '../services/procedimentoService';
import Listagem from '../components/Listagem';
import { moeda } from '../utils/formatadores';

const colunas = [
  { campo: 'nome', titulo: 'Nome' },
  { campo: 'descricao', titulo: 'Descrição' },
  { campo: 'tipoProcedimento', titulo: 'Tipo' },
  { campo: 'valor', titulo: 'Valor', formatar: moeda },
];

export default function Procedimentos() {
  return <Listagem titulo="Procedimentos" descricao="Consulte os procedimentos oferecidos e seus valores." carregar={listar} colunas={colunas} />;
}
