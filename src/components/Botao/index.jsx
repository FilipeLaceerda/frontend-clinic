import "./estilo.css";

export default function Botao({
  variante = "primario",
  className = "",
  children,
  ...props
}) {
  return (
    <button
      className={`botao botao-${variante} ${className}`.trim()}
      type="button"
      {...props}
    >
      {children}
    </button>
  );
}
