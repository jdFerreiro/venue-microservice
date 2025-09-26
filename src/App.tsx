import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import TheatresMasterPage from './pages/TheatresMasterPage';
import SectoresMasterPage from './pages/SectoresMasterPage';
import SalasMasterPage from './pages/SalasMasterPage';
import MapasSalaMasterPage from './pages/MapasSalaMasterPage';
import EstadosSectorMasterPage from './pages/EstadosSectorMasterPage';
import EstadosButacaMasterPage from './pages/EstadosButacaMasterPage';
import ButacasMasterPage from './pages/ButacasMasterPage';


function App() {
   return (
     <Router>
       <Routes>
         <Route path="/teatros" element={<TheatresMasterPage />} />
         <Route path="/sectores" element={<SectoresMasterPage />} />
         <Route path="/salas" element={<SalasMasterPage />} />
         <Route path="/mapas-sala" element={<MapasSalaMasterPage />} />
         <Route path="/estados-sector" element={<EstadosSectorMasterPage />} />
         <Route path="/estados-butaca" element={<EstadosButacaMasterPage />} />
         <Route path="/butacas" element={<ButacasMasterPage />} />
       </Routes>
     </Router>
   );
}

export default App;
