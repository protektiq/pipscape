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
  const cellGap = 1;
  
  // Calculate responsive cell size for print
  const cellSize = useMemo(() => {
    const baseSize = 50; // Smaller for print
    const maxWidth = 700; // Max width for print
    const calculatedWidth = bounds.width * baseSize + (bounds.width - 1) * cellGap;
    if (calculatedWidth > maxWidth) {
      return Math.floor((maxWidth - (bounds.width - 1) * cellGap) / bounds.width);
    }
    return baseSize;
  }, [bounds.width]);
  
  const containerWidth = bounds.width * cellSize + (bounds.width - 1) * cellGap;
  const containerHeight = bounds.height * cellSize + (bounds.height - 1) * cellGap;
  
  return (
    <div className="min-h-screen bg-white p-8 print:p-4">
      <div className="max-w-4xl mx-auto print:max-w-none">
        {/* Header - compact for print */}
        <div className="text-center mb-8 print:mb-2 print:text-left">
          <h1 className="text-4xl font-bold text-gray-900 mb-2 print:text-2xl print:mb-1">PIPSCAPE</h1>
          <p className="text-lg text-gray-600 capitalize print:text-sm">
            Difficulty: {puzzle.difficulty}
          </p>
          <p className="text-sm text-gray-500 mt-2 print:hidden">
            Puzzle ID: {puzzle.id.slice(0, 8)}...
          </p>
        </div>

        {/* Puzzle Grid - fills first page */}
        <div className="mb-24 print:mb-0 print:page-break-after-always" style={{ minHeight: `${containerHeight}px`, paddingBottom: '3rem' }}>
          <div 
            className="relative mx-auto print:w-full print:flex print:justify-center print:items-start"
            style={{ 
              width: `${containerWidth}px`,
              height: `${containerHeight}px`,
            }}
          >
            {/* Background cells - simplified for print, no borders to avoid grid appearance */}
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
              />
            ))}
          </div>
        </div>

        {/* Available Dominoes */}
        <div className="mt-24 mb-8 print:mt-0 print:mb-4 print:page-break-inside-avoid print:page-break-before-always clear-both flex flex-col items-center" style={{ marginTop: '6rem', paddingTop: '3rem' }}>
          <h2 className="text-2xl font-bold text-gray-900 mb-4 print:mb-2 text-center">
            Available Dominoes
          </h2>
          <div className="flex flex-wrap justify-center gap-3 print:gap-2 max-w-4xl">
            {[...puzzle.availableDominoes]
              .sort((a, b) => {
                if (a.left !== b.left) return a.left - b.left;
                return a.right - b.right;
              })
              .map((domino) => (
                <div
                  key={domino.id}
                  className="flex justify-center items-center print:scale-90"
                >
                  <DominoTile
                    left={domino.left}
                    right={domino.right}
                    variant="tray"
                    orientation="horizontal"
                    className="print:w-14 print:h-7"
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

