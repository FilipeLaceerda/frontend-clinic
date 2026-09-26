import './estilo.css';

export default function Botao({ variante = 'primario', children, ...props }) {
  return (
    <button className={`botao botao-${variante}`} type="button" {...props}>
      {children}
    </button>
  );
}
