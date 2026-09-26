import { useNavigate } from 'react-router-dom';
import CabecalhoComAcao from '../../components/CabecalhoComAcao';
import BotaoCadastrar from '../../components/BotaoCadastrar/BotaoCadastrar';
import ListagemAtendimentos from '../../components/ListagemAtendimentos/ListagemAtendimentos';
import Pagina from '../../components/Pagina';
import { listar } from '../../services/atendimentoService';
import './Atendimentos.css';

export default function Atendimentos() {
  const navigate = useNavigate();

  function abrirRota(atendimento, sufixo = '') {
    if (!atendimento._id) return;
    navigate(`/atendimentos/${atendimento._id}${sufixo}`);
  }

  return (
    <Pagina className="pagina-atendimentos">
      <CabecalhoComAcao
        titulo="Atendimentos"
        descricao="Consulte os horários e as informações dos atendimentos."
        acao={
          <BotaoCadastrar
            labelButton="Cadastrar atendimento"
            onClick={() => navigate('/atendimentos/novo')}
          />
        }
      />
      <ListagemAtendimentos
        carregar={listar}
        onEditar={(atendimento) => abrirRota(atendimento, '/editar')}
        onVisualizar={abrirRota}
      />
    </Pagina>
  );
}
