import { Navigate, Route, Routes } from 'react-router-dom';
import BarraLateral from './components/BarraLateral';
import Home from './pages/Home';
import Atendimentos from './pages/Atendimentos/Atendimentos';
import FormularioAtendimento from './pages/FormularioAtendimento/FormularioAtendimento';
import VisualizarAtendimento from './pages/VisualizarAtendimento/VisualizarAtendimento';
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
          <Route path="/atendimentos/novo" element={<FormularioAtendimento />} />
          <Route path="/atendimentos/:id/editar" element={<FormularioAtendimento />} />
          <Route path="/atendimentos/:id" element={<VisualizarAtendimento />} />
          <Route path="/dentistas" element={<Dentistas />} />
          <Route path="/procedimentos" element={<Procedimentos />} />
          <Route path="/secretarias" element={<Secretarias />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </div>
  );
}
