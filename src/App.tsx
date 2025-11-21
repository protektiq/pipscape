import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Play from './pages/Play';
import Print from './pages/Print';

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/play/:difficulty?" element={<Play />} />
        <Route path="/puzzle/:id" element={<Play />} />
        <Route path="/puzzle/:id/print" element={<Print />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
