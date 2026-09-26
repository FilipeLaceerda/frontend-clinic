import editIcon from "../../assets/modify.svg";
import deleteIcon from "../../assets/delete.svg";
import viewIcon from '../../assets/view.svg';
import "./estilo.css";

export function BotaoIcone({
  variante = "default",
  label,
  titulo,
  onClick,
  disabled = false,
  children,
  className = "",
}) {
  return (
    <button
      type="button"
      className={["icon-button", variante, className].filter(Boolean).join(" ")}
      onClick={onClick}
      aria-label={label}
      title={titulo}
      disabled={disabled}
    >
      {children}
    </button>
  );
}

export function BotaoVisualizarMais({ item, onClick }) {
  const descricao = item.nome || `atendimento ${item.idAtendimento}`;

  return (
    <BotaoIcone
      variante="view"
      label={`Visualizar ${descricao}`}
      titulo="Visualizar mais"
      onClick={onClick}
    >
      <img src={viewIcon} alt="" className="icon" />
    </BotaoIcone>
  );
}

export default function AcoesTabela({
  item,
  emEdicao,
  valorEditado,
  onChangeValor,
  onEditar,
  onSalvar,
  onCancelar,
  onExcluir,
  onVisualizar,
  processandoId,
  disabled = false,
}) {
  const descricao = item.nome || `atendimento ${item.idAtendimento}`;
  if (emEdicao) {
    return (
      <>
        <button
          type="button"
          className="icon-button success"
          onClick={onSalvar}
          disabled={processandoId === item._id}
          aria-label="Salvar alterações"
        >
          Salvar
        </button>
        <button
          type="button"
          className="icon-button secondary"
          onClick={onCancelar}
          aria-label="Cancelar edição"
        >
          Cancelar
        </button>
      </>
    );
  }

  return (
    <>
      {onVisualizar && (
        <BotaoVisualizarMais item={item} onClick={onVisualizar} />
      )}

      {onEditar && (
        <BotaoIcone
          variante="edit"
          label={`Alterar ${descricao}`}
          titulo="Alterar"
          onClick={onEditar}
          disabled={disabled}
        >
          <img src={editIcon} alt="" className="icon" />
        </BotaoIcone>
      )}

      {onExcluir && (
        <BotaoIcone
          variante="delete"
          label={`Excluir ${descricao}`}
          titulo="Excluir"
          onClick={onExcluir}
          disabled={disabled || processandoId === item._id}
        >
          <img src={deleteIcon} alt="" className="icon" />
        </BotaoIcone>
      )}
    </>
  );
}
