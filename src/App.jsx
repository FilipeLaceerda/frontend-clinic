import { NavLink, Navigate, Route, Routes } from 'react-router-dom';
import Atendimentos from './pages/Atendimentos';
import Dentistas from './pages/Dentistas';
import Procedimentos from './pages/Procedimentos';
import Secretarias from './pages/Secretarias';
import { useApi } from './services/api';

const paginas = [
  ['/atendimentos', 'Atendimentos'], ['/dentistas', 'Dentistas'],
  ['/procedimentos', 'Procedimentos'], ['/secretarias', 'Secretárias'],
];

export default function App() {
  return (
    <div className="layout">
      <aside>
        <a className="brand" href="/">+ Clinic</a>
        <p>Gestão odontológica</p>
        <nav aria-label="Menu principal">
          {paginas.map(([path, label]) => <NavLink key={path} to={path}>{label}</NavLink>)}
        </nav>
        <small>{useApi ? 'Conectado à configuração da API' : 'Demonstração · dados locais'}</small>
      </aside>
      <main>
        <Routes>
          <Route path="/atendimentos" element={<Atendimentos />} />
          <Route path="/dentistas" element={<Dentistas />} />
          <Route path="/procedimentos" element={<Procedimentos />} />
          <Route path="/secretarias" element={<Secretarias />} />
          <Route path="*" element={<Navigate to="/atendimentos" replace />} />
        </Routes>
      </main>
    </div>
  );
}
