import './BotaoVisualizarMais.css';

export default function BotaoVisualizarMais({ atendimento, onClick }) {
  return <button className="botao-visualizar-mais" type="button" onClick={() => onClick(atendimento)}>Visualizar mais</button>;
}
