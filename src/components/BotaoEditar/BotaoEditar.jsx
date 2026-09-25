import './BotaoEditar.css';

export default function BotaoEditar({ atendimento, onClick }) {
  return <button className="botao-editar" type="button" onClick={() => onClick(atendimento)}>Editar</button>;
}
