import { useMemo } from 'react';
import type { Puzzle } from '../types/puzzle';
import { buildCellLookup } from '../types/puzzle';
import RegionComponent from './Region';
import DominoTile from './DominoTile';

interface PrintLayoutProps {
  puzzle: Puzzle;
}

const PrintLayout = ({ puzzle }: PrintLayoutProps) => {
  // Memoize cell lookup map - only recalculate when puzzle.cells changes
  const cellMap = useMemo(() => buildCellLookup(puzzle), [puzzle.cells]);
  const rows = puzzle.rows;
  const cols = puzzle.cols;
  
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
        <div className="mb-8 print:mb-0 print:page-break-after-always print:min-h-[calc(100vh-4cm)] print:flex print:flex-col print:justify-center">
          <div className="relative mx-auto print:w-full print:flex print:justify-center print:items-center" style={{ width: 'fit-content' }}>
            {/* Background grid layer */}
            <div
              className="grid gap-0 border-2 border-gray-300 bg-white print:border-gray-600"
              style={{
                gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))`,
                gridTemplateRows: `repeat(${rows}, minmax(0, 1fr))`,
                width: 'min(85vw, calc(100vh - 5cm), 750px)',
                height: 'min(85vw, calc(100vh - 5cm), 750px)',
              }}
            >
              {Array.from({ length: rows }).map((_, row) =>
                Array.from({ length: cols }).map((_, col) => {
                  const key = `${row}-${col}`;
                  const cellExists = cellMap.has(key);
                  return (
                    <div
                      key={`bg-${row}-${col}`}
                      className={`aspect-square border-r border-b border-gray-200 print:border-gray-400 pointer-events-none ${
                        !cellExists ? 'bg-transparent' : ''
                      }`}
                    />
                  );
                })
              )}
            </div>

            {/* Region layers */}
            {puzzle.regions.map(region => (
              <RegionComponent
                key={region.id}
                region={region}
                puzzle={puzzle}
                allRegions={puzzle.regions}
              />
            ))}

            {/* Empty cells layer for print */}
            <div
              className="grid gap-0 absolute inset-0"
              style={{
                gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))`,
                gridTemplateRows: `repeat(${rows}, minmax(0, 1fr))`,
              }}
            >
              {Array.from({ length: rows }).map((_, row) =>
                Array.from({ length: cols }).map((_, col) => (
                  <div
                    key={`${row}-${col}`}
                    className="aspect-square flex items-center justify-center bg-transparent pointer-events-none"
                  />
                ))
              )}
            </div>
          </div>
        </div>

        {/* Available Dominoes */}
        <div className="mb-8 print:mb-4 print:page-break-inside-avoid">
          <h2 className="text-2xl font-bold text-gray-900 mb-4 print:mb-2">
            Available Dominoes
          </h2>
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-3 print:grid-cols-6 print:gap-2">
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

