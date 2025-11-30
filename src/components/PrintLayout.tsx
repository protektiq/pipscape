import { useMemo } from 'react';
import type { Puzzle } from '../types/puzzle';
import RegionComponent from './Region';
import DominoTile from './DominoTile';

interface PrintLayoutProps {
  puzzle: Puzzle;
}

const PrintLayout = ({ puzzle }: PrintLayoutProps) => {
  // Calculate actual bounding box from cells (not the full grid)
  const bounds = useMemo(() => {
    if (puzzle.cells.length === 0) {
      return { minRow: 0, maxRow: 0, minCol: 0, maxCol: 0, width: 1, height: 1 };
    }
    const rows = puzzle.cells.map(c => c.row);
    const cols = puzzle.cells.map(c => c.col);
    const minRow = Math.min(...rows);
    const maxRow = Math.max(...rows);
    const minCol = Math.min(...cols);
    const maxCol = Math.max(...cols);
    return {
      minRow,
      maxRow,
      minCol,
      maxCol,
      width: maxCol - minCol + 1,
      height: maxRow - minRow + 1,
    };
  }, [puzzle.cells]);

  // Cell gap for print (smaller than screen)
  const cellGap = 2;
  
  // Calculate responsive cell size for print - sized for real dominoes
  // Real dominoes are 2.5" × 1.25", so each cell should be 1.25" × 1.25"
  // At 96 DPI, 1.25 inches = 120px
  const cellSize = useMemo(() => {
    const baseSize = 120; // 1.25 inches at 96 DPI, sized for real dominoes (2.5" × 1.25")
    const maxWidth = 1800; // Max width for print (allows larger puzzles)
    const calculatedWidth = bounds.width * baseSize + (bounds.width - 1) * cellGap;
    if (calculatedWidth > maxWidth) {
      return Math.floor((maxWidth - (bounds.width - 1) * cellGap) / bounds.width);
    }
    return baseSize;
  }, [bounds.width]);
  
  const containerWidth = bounds.width * cellSize + (bounds.width - 1) * cellGap;
  const containerHeight = bounds.height * cellSize + (bounds.height - 1) * cellGap;
  
  return (
    <div className="print-container">
      {/* Page 1: Title and Puzzle */}
      <div className="print-page print-page-1">
        <div className="print-page-content">
          <div className="print-header">
            <h1>PIPSCAPE</h1>
            <p>Difficulty: {puzzle.difficulty}</p>
          </div>
          <div className="print-puzzle-container">
            <div 
              className="print-puzzle"
              style={{ 
                width: `${containerWidth}px`,
                height: `${containerHeight}px`,
              }}
            >
              {/* Background cells */}
              {puzzle.cells.map(cell => {
                const { row, col } = cell;
                const relativeRow = row - bounds.minRow;
                const relativeCol = col - bounds.minCol;
                const left = relativeCol * (cellSize + cellGap);
                const top = relativeRow * (cellSize + cellGap);
                
                return (
                  <div
                    key={`bg-${row}-${col}`}
                    className="absolute pointer-events-none"
                    style={{
                      left: `${left}px`,
                      top: `${top}px`,
                      width: `${cellSize}px`,
                      height: `${cellSize}px`,
                      backgroundColor: 'white',
                    }}
                  />
                );
              })}

              {/* Region layers */}
              {puzzle.regions.map(region => (
                <RegionComponent
                  key={region.id}
                  region={region}
                  puzzle={puzzle}
                  allRegions={puzzle.regions}
                  cellGap={cellGap}
                  cellSize={cellSize}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Page 2: Available Dominoes */}
      <div className="print-page print-page-2">
        <div className="print-page-content">
          <h2 className="print-dominoes-title">Available Dominoes</h2>
          <div className="print-dominoes-grid">
            {[...puzzle.availableDominoes]
              .sort((a, b) => {
                if (a.left !== b.left) return a.left - b.left;
                return a.right - b.right;
              })
              .map((domino) => (
                <div key={domino.id} className="print-domino-item">
                  <DominoTile
                    left={domino.left}
                    right={domino.right}
                    variant="tray"
                    orientation="horizontal"
                  />
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrintLayout;
