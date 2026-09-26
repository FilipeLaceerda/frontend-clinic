import editIcon from "../../assets/modify.svg";
import deleteIcon from "../../assets/delete.svg";
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

export default function AcoesTabela({
  item,
  emEdicao,
  valorEditado,
  onChangeValor,
  onEditar,
  onSalvar,
  onCancelar,
  onExcluir,
  processandoId,
  disabled = false,
}) {
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
      <BotaoIcone
        variante="edit"
        label={`Alterar ${item.nome}`}
        titulo="Alterar"
        onClick={onEditar}
        disabled={disabled}
      >
        <img src={editIcon} alt="" className="icon" />
      </BotaoIcone>

      <BotaoIcone
        variante="delete"
        label={`Excluir ${item.nome}`}
        titulo="Excluir"
        onClick={onExcluir}
        disabled={disabled || processandoId === item._id}
      >
        <img src={deleteIcon} alt="" className="icon" />
      </BotaoIcone>
    </>
  );
}
