import BotaoEditar from '../BotaoEditar/BotaoEditar';
import BotaoVisualizarMais from '../BotaoVisualizarMais/BotaoVisualizarMais';
import './MaisAcoes.css';

export default function MaisAcoes({ atendimento, onEditar, onVisualizar }) {
  return (
    <details className="mais-acoes">
      <summary aria-label={`Mais ações para atendimento ${atendimento.idAtendimento}`}>Mais</summary>
      <div className="menu-acoes">
        <BotaoEditar atendimento={atendimento} onClick={onEditar} />
        <BotaoVisualizarMais atendimento={atendimento} onClick={onVisualizar} />
      </div>
    </details>
  );
}
