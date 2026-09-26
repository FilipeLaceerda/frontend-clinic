import { NavLink } from 'react-router-dom';
import './estilo.css';

export default function BarraLateral({ paginas }) {
  return (
    <aside className="barra-lateral">
      <a className="brand" href="/">+ Clinic</a>
      <p>Gestão odontológica</p>
      <nav aria-label="Menu principal">
        {paginas.map(([path, label]) => (
          <NavLink key={path} to={path}>{label}</NavLink>
        ))}
      </nav>
    </aside>
  );
}
