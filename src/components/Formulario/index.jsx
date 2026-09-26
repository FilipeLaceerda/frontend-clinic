import "./estilo.css";

export function Formulario({ children, onSubmit }) {
  return (
    <form className="formulario" onSubmit={onSubmit}>
      {children}
    </form>
  );
}

export function CamposFormulario({ children }) {
  return <div className="campos-formulario">{children}</div>;
}

export function AcoesFormulario({ children }) {
  return <div className="acoes-formulario">{children}</div>;
}
