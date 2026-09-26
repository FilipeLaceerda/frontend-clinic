import Botao from '../Botao';
import './MaisAcoes.css';

export default function MaisAcoes({ atendimento, onEditar, onVisualizar }) {
  return (
    <details className="mais-acoes">
      <summary aria-label={`Mais ações para atendimento ${atendimento.idAtendimento}`}>Mais</summary>
      <div className="menu-acoes">
        <Botao variante="menu" onClick={() => onEditar(atendimento)}>
          Editar
        </Botao>
        <Botao variante="menu" onClick={() => onVisualizar(atendimento)}>
          Visualizar mais
        </Botao>
      </div>
    </details>
  );
}
