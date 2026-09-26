import './estilo.css';

export default function Pagina({ className = '', children }) {
  return <section className={`pagina ${className}`.trim()}>{children}</section>;
}
