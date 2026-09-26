import './TituloColuna.css';

export default function TituloColuna({ children }) {
  return <th className="titulo-coluna" scope="col">{children}</th>;
}
