import { useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Play from './pages/Play';
import Print from './pages/Print';
import { puzzlePool } from './engine/puzzlePool';

const App = () => {
  // Pre-generate puzzles in background for instant loading
  // This runs asynchronously and doesn't block the UI
  useEffect(() => {
    // Start pregeneration immediately but asynchronously
    // Use setTimeout with 0 delay to ensure it runs after initial render
    setTimeout(() => {
      puzzlePool.pregenerateAll().catch((error) => {
        // Silently handle errors - puzzles will generate on-demand if pre-generation fails
        console.debug('Background puzzle pre-generation error:', error);
      });
    }, 0);
  }, []);

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
