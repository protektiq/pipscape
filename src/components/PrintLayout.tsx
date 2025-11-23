import type { Puzzle } from '../types/puzzle';
import { getRegionColor } from '../engine/regionUtils';
import RegionComponent from './Region';

interface PrintLayoutProps {
  puzzle: Puzzle;
}

const PrintLayout = ({ puzzle }: PrintLayoutProps) => {
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
                gridTemplateColumns: `repeat(${puzzle.gridSize}, minmax(0, 1fr))`,
                width: 'min(85vw, calc(100vh - 5cm), 750px)',
                height: 'min(85vw, calc(100vh - 5cm), 750px)',
              }}
            >
              {Array.from({ length: puzzle.gridSize }).map((_, row) =>
                Array.from({ length: puzzle.gridSize }).map((_, col) => (
                  <div
                    key={`bg-${row}-${col}`}
                    className="aspect-square border-r border-b border-gray-200 print:border-gray-400 pointer-events-none"
                  />
                ))
              )}
            </div>

            {/* Region layers */}
            {puzzle.regions.map(region => (
              <RegionComponent
                key={region.id}
                region={region}
                gridSize={puzzle.gridSize}
                allRegions={puzzle.regions}
              />
            ))}

            {/* Empty cells layer for print */}
            <div
              className="grid gap-0 absolute inset-0"
              style={{
                gridTemplateColumns: `repeat(${puzzle.gridSize}, minmax(0, 1fr))`,
              }}
            >
              {Array.from({ length: puzzle.gridSize }).map((_, row) =>
                Array.from({ length: puzzle.gridSize }).map((_, col) => (
                  <div
                    key={`${row}-${col}`}
                    className="aspect-square flex items-center justify-center bg-transparent pointer-events-none"
                  />
                ))
              )}
            </div>
          </div>
        </div>

        {/* Region Rules - starts on second page */}
        <div className="mb-8 print:mb-4 print:page-break-before-always">
          <h2 className="text-2xl font-bold text-gray-900 mb-4 print:mb-2">
            Region Rules
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 print:grid-cols-2">
            {puzzle.regions.map((region, index) => {
              const ruleText =
                region.rule.type === 'SUM_AT_LEAST'
                  ? `Sum ≥ ${region.rule.value}`
                  : region.rule.type === 'SUM_AT_MOST'
                  ? `Sum ≤ ${region.rule.value}`
                  : region.rule.type === 'VALUES_EQUAL'
                  ? 'All values equal'
                  : 'All values different';
              
              const color = getRegionColor(region.id);

              return (
                <div
                  key={region.id}
                  className="border-2 rounded-lg p-4"
                  style={{
                    borderColor: color.border,
                    backgroundColor: `${color.bg}15`, // 15% opacity
                  }}
                >
                  <div 
                    className="font-semibold mb-2"
                    style={{ color: color.border }}
                  >
                    Region {index + 1}
                  </div>
                  <div 
                    className="text-lg font-medium"
                    style={{ color: color.border }}
                  >
                    {ruleText}
                  </div>
                  <div className="text-sm text-gray-600 mt-1">
                    {region.cells.length} cells
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Instructions */}
        <div className="border-t border-gray-300 pt-6 print:pt-4 print:border-gray-600">
          <h3 className="text-xl font-semibold text-gray-900 mb-3 print:mb-2">
            Instructions
          </h3>
          <ol className="list-decimal list-inside space-y-2 text-gray-700 print:text-sm">
            <li>Place dominoes on the grid to satisfy all region rules.</li>
            <li>Each domino covers two adjacent cells (horizontally or vertically).</li>
            <li>
              Each region has a constraint that must be satisfied: sum ≥ value, sum ≤ value, all values equal, or all values different.
            </li>
            <li>Use all available dominoes exactly once.</li>
          </ol>
        </div>
      </div>
    </div>
  );
};

export default PrintLayout;

