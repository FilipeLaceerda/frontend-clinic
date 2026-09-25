import { Navigate, Route, Routes } from 'react-router-dom';
import BarraLateral from './components/BarraLateral';
import Home from '.pages/Home';
import Atendimentos from './pages/Atendimentos';
import Dentistas from './pages/Dentistas';
import Procedimentos from './pages/Procedimentos';
import Secretarias from './pages/Secretarias';

const paginas = [
  ['/', 'Home'],
  ['/atendimentos', 'Atendimentos'],
  ['/dentistas', 'Dentistas'],
  ['/procedimentos', 'Procedimentos'],
  ['/secretarias', 'Secretárias'],
];

export default function App() {
  return (
    <div className="layout">
      <BarraLateral paginas={paginas} />
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/atendimentos" element={<Atendimentos />} />
          <Route path="/dentistas" element={<Dentistas />} />
          <Route path="/procedimentos" element={<Procedimentos />} />
          <Route path="/secretarias" element={<Secretarias />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </div>
  );
}
