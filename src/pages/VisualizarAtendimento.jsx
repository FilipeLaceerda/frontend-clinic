import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import TituloPagina from '../components/TituloPagina/TituloPagina';
import { buscarPorId } from '../services/atendimentoService';
import { dataBR, moeda } from '../utils/formatadores';
import './VisualizarAtendimento.css';

const statusLegivel = (valor) => ({ AGENDADO: 'Agendado', CANCELADO: 'Cancelado', CONCLUIDO: 'Concluído', 'CONCLUÍDO': 'Concluído' }[valor] || valor || '—');

export default function VisualizarAtendimento() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [atendimento, setAtendimento] = useState(null);
  const [erro, setErro] = useState('');

  useEffect(() => {
    const controller = new AbortController();
    buscarPorId(id, controller.signal)
      .then((dados) => { if (!controller.signal.aborted) setAtendimento(dados); })
      .catch((error) => { if (!controller.signal.aborted) setErro(error.response?.data?.error || 'Não foi possível carregar o atendimento.'); });
    return () => controller.abort();
  }, [id]);

  if (erro) return <p className="notice" role="alert">{erro}</p>;
  if (!atendimento) return <p className="notice" role="status">Carregando atendimento…</p>;

  const campos = [
    ['Número', atendimento.idAtendimento], ['Data', dataBR(atendimento.data)], ['Horário', `${atendimento.horario_inicio?.slice(0, 5)} – ${atendimento.horario_fim?.slice(0, 5)}`], ['Status', statusLegivel(atendimento.status)], ['Tipo', atendimento.tipoAtendimento], ['CPF do paciente', atendimento.fk_CPF_Paciente], ['CPF da secretária', atendimento.fk_CPF_Secretaria], ['Valor total', moeda(atendimento.valorTotal)], ['Parcelas', atendimento.parcelas], ['Observação', atendimento.observacao || '—'],
  ];

  return (
    <section className="pagina-visualizar-atendimento">
      <TituloPagina titulo={`Atendimento #${atendimento.idAtendimento}`} descricao="Todos os dados registrados para este atendimento." />
      <div className="dados-atendimento">
        {campos.map(([titulo, valor]) => <div key={titulo}><dt>{titulo}</dt><dd>{valor}</dd></div>)}
      </div>
      <div className="acoes-visualizacao">
        <button type="button" className="botao-secundario" onClick={() => navigate('/atendimentos')}>Voltar</button>
        <button type="button" onClick={() => navigate(`/atendimentos/${id}/editar`)}>Editar atendimento</button>
      </div>
    </section>
  );
}
