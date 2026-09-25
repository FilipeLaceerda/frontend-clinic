import { useNavigate } from 'react-router-dom';
import { listar } from '../services/atendimentoService';
import BotaoCadastrar from '../components/BotaoCadastrar/BotaoCadastrar';
import ListagemAtendimentos from '../components/ListagemAtendimentos/ListagemAtendimentos';
import TituloPagina from '../components/TituloPagina/TituloPagina';
import './Atendimentos.css';

export default function Atendimentos() {
  const navigate = useNavigate();

  function abrirRota(atendimento, sufixo = '') {
    if (!atendimento._id) return;
    navigate(`/atendimentos/${atendimento._id}${sufixo}`);
  }

  return (
    <section className="pagina-atendimentos">
      <div className="cabecalho-atendimentos">
        <TituloPagina titulo="Atendimentos" descricao="Consulte os horários e as informações dos atendimentos." />
        <BotaoCadastrar labelButton="Cadastrar atendimento" onClick={() => navigate('/atendimentos/novo')} />
      </div>
      <ListagemAtendimentos carregar={listar} onEditar={(atendimento) => abrirRota(atendimento, '/editar')} onVisualizar={abrirRota} />
    </section>
  );
}
