import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Botao from '../../components/Botao';
import DetalhesAtendimento from '../../components/DetalhesAtendimento';
import GrupoAcoes from '../../components/GrupoAcoes';
import Header from '../../components/Header';
import MensagemEstado from '../../components/MensagemEstado';
import Pagina from '../../components/Pagina';
import { buscarPorId } from '../../services/atendimentoService';
import { dataBR, moeda } from '../../utils/formatadores';
import './VisualizarAtendimento.css';

const statusLegivel = (valor) =>
  ({
    AGENDADO: 'Agendado',
    CANCELADO: 'Cancelado',
    CONCLUIDO: 'Concluído',
    CONCLUÍDO: 'Concluído',
  })[valor] ||
  valor ||
  '—';

export default function VisualizarAtendimento() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [atendimento, setAtendimento] = useState(null);
  const [erro, setErro] = useState('');

  useEffect(() => {
    const controller = new AbortController();
    buscarPorId(id, controller.signal)
      .then((dados) => {
        if (!controller.signal.aborted) setAtendimento(dados);
      })
      .catch((error) => {
        if (!controller.signal.aborted)
          setErro(
            error.response?.data?.error ||
              'Não foi possível carregar o atendimento.',
          );
      });
    return () => controller.abort();
  }, [id]);

  if (erro) {
    return <MensagemEstado tipo="erro">{erro}</MensagemEstado>;
  }

  if (!atendimento) {
    return <MensagemEstado>Carregando atendimento…</MensagemEstado>;
  }

  const campos = [
    ['Número', atendimento.idAtendimento],
    ['Data', dataBR(atendimento.data)],
    [
      'Horário',
      `${atendimento.horario_inicio?.slice(0, 5)} – ${atendimento.horario_fim?.slice(0, 5)}`,
    ],
    ['Status', statusLegivel(atendimento.status)],
    ['Tipo', atendimento.tipoAtendimento],
    ['CPF do paciente', atendimento.fk_CPF_Paciente],
    ['CPF da secretária', atendimento.fk_CPF_Secretaria],
    ['Valor total', moeda(atendimento.valorTotal)],
    ['Parcelas', atendimento.parcelas],
    ['Observação', atendimento.observacao || '—'],
  ];

  return (
    <Pagina className="pagina-visualizar-atendimento">
      <Header
        titulo={`Atendimento #${atendimento.idAtendimento}`}
        descricao="Todos os dados registrados para este atendimento."
      />
      <DetalhesAtendimento campos={campos} />
      <GrupoAcoes>
        <Botao variante="secundario" onClick={() => navigate('/atendimentos')}>
          Voltar
        </Botao>
        <Botao onClick={() => navigate(`/atendimentos/${id}/editar`)}>
          Editar atendimento
        </Botao>
      </GrupoAcoes>
    </Pagina>
  );
}
