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
  const [procedimentos, setProcedimentos] = useState([]);
  const [busca, setBusca] = useState('');

  useEffect(() => {
    async function carregarProcedimentos() {
      const lista = await listar();
      setProcedimentos(lista);
    }

    carregarProcedimentos();
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

        <Tabela
          titulo="Procedimentos"
          colunas={colunas}
          dados={procedimentosFiltrados}
        />
      </div>
    </section>
  );
}
