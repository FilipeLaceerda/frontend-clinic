import { listar } from '../services/procedimentoService';
import { moeda } from '../utils/formatadores';
import CabecalhoComAcao from '../components/CabecalhoComAcao';
import Listagem from '../components/Listagem';
import Pagina from '../components/Pagina';

const colunas = [
  { campo: 'nome', titulo: 'Nome' },
  { campo: 'descricao', titulo: 'Descrição' },
  { campo: 'tipoProcedimento', titulo: 'Tipo' },
  { campo: 'valor', titulo: 'Valor', formatar: moeda },
];

export default function Procedimentos() {
  return (
    <Pagina>
      <CabecalhoComAcao
        titulo="Procedimentos"
        descricao="Consulte os procedimentos oferecidos e seus valores."
      />
      <Listagem
        tituloTabela="Procedimentos"
        carregar={listar}
        colunas={colunas}
        rotuloBusca="Buscar procedimentos"
        placeholderBusca="Digite para buscar…"
      />
    </Pagina>
  );
}
