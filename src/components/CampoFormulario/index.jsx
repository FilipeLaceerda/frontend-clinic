import './estilo.css';

export default function CampoFormulario({ rotulo, largo = false, children }) {
  return (
    <label className={`campo-formulario ${largo ? 'campo-formulario-largo' : ''}`}>
      <span>{rotulo}</span>
      {children}
    </label>
  );
}
