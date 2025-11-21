import { useEffect } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { generatePuzzle } from '../engine/generator';
import type { Puzzle, RegionRule } from '../types/puzzle';
import { GRID_SIZE } from '../types/puzzle';
import { useState } from 'react';

const Print = () => {
  const { id } = useParams<{ id: string }>();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [puzzle, setPuzzle] = useState<Puzzle | null>(null);

  useEffect(() => {
    if (id) {
      const seed = searchParams.get('seed');
      const difficultyParam = searchParams.get('difficulty');
      const difficulty = (difficultyParam === 'easy' || difficultyParam === 'medium' || difficultyParam === 'hard')
        ? difficultyParam
        : 'medium';
      
      if (seed) {
        // Regenerate puzzle from seed
        const newPuzzle = generatePuzzle(difficulty, seed);
        setPuzzle(newPuzzle);
      } else {
        // Fallback: generate new puzzle
        const newPuzzle = generatePuzzle(difficulty);
        setPuzzle(newPuzzle);
      }
    } else {
      navigate('/');
    }
  }, [id, searchParams, navigate]);

  const handlePrint = () => {
    window.print();
  };

  const handleBack = () => {
    navigate(-1);
  };

  if (!puzzle) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Loading puzzle...</p>
      </div>
    );
  }

  // Region color palette with RGB values for inline styles
  const REGION_COLORS = [
    { name: 'blue', bg: 'rgb(59, 130, 246)', border: 'rgb(37, 99, 235)' },
    { name: 'green', bg: 'rgb(34, 197, 94)', border: 'rgb(22, 163, 74)' },
    { name: 'purple', bg: 'rgb(168, 85, 247)', border: 'rgb(147, 51, 234)' },
    { name: 'orange', bg: 'rgb(249, 115, 22)', border: 'rgb(234, 88, 12)' },
    { name: 'pink', bg: 'rgb(236, 72, 153)', border: 'rgb(219, 39, 119)' },
    { name: 'teal', bg: 'rgb(20, 184, 166)', border: 'rgb(15, 118, 110)' },
    { name: 'amber', bg: 'rgb(245, 158, 11)', border: 'rgb(217, 119, 6)' },
    { name: 'indigo', bg: 'rgb(99, 102, 241)', border: 'rgb(79, 70, 229)' },
    { name: 'rose', bg: 'rgb(244, 63, 94)', border: 'rgb(225, 29, 72)' },
    { name: 'cyan', bg: 'rgb(6, 182, 212)', border: 'rgb(8, 145, 178)' },
  ];

  // Generate consistent color from region ID
  const getRegionColor = (regionId: string) => {
    let hash = 0;
    for (let i = 0; i < regionId.length; i++) {
      hash = ((hash << 5) - hash) + regionId.charCodeAt(i);
      hash = hash & hash;
    }
    const index = Math.abs(hash) % REGION_COLORS.length;
    return REGION_COLORS[index];
  };

  // Format rule label
  const formatRuleLabel = (rule: RegionRule): string => {
    if (rule.type === 'SUM_AT_LEAST') {
      return `≥${rule.value}`;
    } else if (rule.type === 'SUM_AT_MOST') {
      return `≤${rule.value}`;
    }
    return `${rule.value}`;
  };

  // Edge information for a cell
  type EdgeInfo = {
    top: boolean;
    right: boolean;
    bottom: boolean;
    left: boolean;
  };

  // Check if a cell is in a region
  const isCellInRegion = (row: number, col: number, regionId: string): boolean => {
    const region = puzzle.regions.find(r => r.id === regionId);
    if (!region) return false;
    return region.cells.some(cell => cell.row === row && cell.col === col);
  };

  // Get boundary edge information for a cell
  const getRegionEdgeInfo = (
    row: number, 
    col: number, 
    regionId: string
  ): EdgeInfo => {
    const top = row === 0 || !isCellInRegion(row - 1, col, regionId);
    const right = col === GRID_SIZE - 1 || !isCellInRegion(row, col + 1, regionId);
    const bottom = row === GRID_SIZE - 1 || !isCellInRegion(row + 1, col, regionId);
    const left = col === 0 || !isCellInRegion(row, col - 1, regionId);
    
    return { top, right, bottom, left };
  };

  // Check if a corner is an outer corner (convex corner)
  const isOuterCorner = (
    row: number,
    col: number,
    regionId: string,
    corner: 'tl' | 'tr' | 'bl' | 'br'
  ): boolean => {
    const edgeInfo = getRegionEdgeInfo(row, col, regionId);
    
    if (corner === 'tl') {
      return edgeInfo.top && edgeInfo.left && 
             !isCellInRegion(row - 1, col - 1, regionId);
    } else if (corner === 'tr') {
      return edgeInfo.top && edgeInfo.right &&
             !isCellInRegion(row - 1, col + 1, regionId);
    } else if (corner === 'bl') {
      return edgeInfo.bottom && edgeInfo.left &&
             !isCellInRegion(row + 1, col - 1, regionId);
    } else if (corner === 'br') {
      return edgeInfo.bottom && edgeInfo.right &&
             !isCellInRegion(row + 1, col + 1, regionId);
    }
    
    return false;
  };

  // Calculate region bounds for badge positioning
  const getRegionBounds = (regionId: string) => {
    const region = puzzle.regions.find(r => r.id === regionId);
    if (!region || region.cells.length === 0) return null;
    
    let minRow = region.cells[0].row;
    let maxRow = region.cells[0].row;
    let minCol = region.cells[0].col;
    let maxCol = region.cells[0].col;
    
    region.cells.forEach(cell => {
      minRow = Math.min(minRow, cell.row);
      maxRow = Math.max(maxRow, cell.row);
      minCol = Math.min(minCol, cell.col);
      maxCol = Math.max(maxCol, cell.col);
    });
    
    return { minRow, maxRow, minCol, maxCol };
  };

  return (
    <div className="min-h-screen bg-white p-8 print:p-4">
      {/* Print controls - hidden when printing */}
      <div className="mb-6 print:hidden flex gap-4">
        <button
          onClick={handlePrint}
          className="px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-semibold"
        >
          Print Puzzle
        </button>
        <button
          onClick={handleBack}
          className="px-6 py-3 bg-gray-200 hover:bg-gray-300 rounded-lg font-semibold"
        >
          Back
        </button>
      </div>

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

            {/* Region backgrounds layer */}
            {puzzle.regions.map(region => {
              const color = getRegionColor(region.id);
              
              return (
                <div
                  key={`region-bg-${region.id}`}
                  className="absolute inset-0 pointer-events-none"
                >
                  {region.cells.map(cell => {
                    const cellSize = `calc(100% / ${puzzle.gridSize})`;
                    return (
                      <div
                        key={`bg-${cell.row}-${cell.col}`}
                        style={{
                          position: 'absolute',
                          top: `${(cell.row / puzzle.gridSize) * 100}%`,
                          left: `${(cell.col / puzzle.gridSize) * 100}%`,
                          width: cellSize,
                          height: cellSize,
                          backgroundColor: color.bg,
                          opacity: 0.15, // Lighter for print
                        }}
                      />
                    );
                  })}
                </div>
              );
            })}

            {/* Region borders layer */}
            {puzzle.regions.map(region => {
              const color = getRegionColor(region.id);
              
              return (
                <div
                  key={`region-border-${region.id}`}
                  className="absolute inset-0 pointer-events-none"
                >
                  {region.cells.map(cell => {
                    const edgeInfo = getRegionEdgeInfo(
                      cell.row,
                      cell.col,
                      region.id
                    );
                    
                    const cellSize = `calc(100% / ${puzzle.gridSize})`;
                    const borderWidth = '2px';
                    const isOuterTL = isOuterCorner(cell.row, cell.col, region.id, 'tl');
                    const isOuterTR = isOuterCorner(cell.row, cell.col, region.id, 'tr');
                    const isOuterBL = isOuterCorner(cell.row, cell.col, region.id, 'bl');
                    const isOuterBR = isOuterCorner(cell.row, cell.col, region.id, 'br');
                    
                    return (
                      <div
                        key={`border-${cell.row}-${cell.col}`}
                        className="border-dashed"
                        style={{
                          position: 'absolute',
                          top: `${(cell.row / puzzle.gridSize) * 100}%`,
                          left: `${(cell.col / puzzle.gridSize) * 100}%`,
                          width: cellSize,
                          height: cellSize,
                          borderTopWidth: edgeInfo.top ? borderWidth : '0',
                          borderRightWidth: edgeInfo.right ? borderWidth : '0',
                          borderBottomWidth: edgeInfo.bottom ? borderWidth : '0',
                          borderLeftWidth: edgeInfo.left ? borderWidth : '0',
                          borderColor: color.border,
                          borderRadius: `${isOuterTL ? '0.375rem' : '0'} ${isOuterTR ? '0.375rem' : '0'} ${isOuterBR ? '0.375rem' : '0'} ${isOuterBL ? '0.375rem' : '0'}`,
                        }}
                      />
                    );
                  })}
                </div>
              );
            })}

            {/* Interactive cells layer */}
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
                  >
                    {/* Cell content - empty for print */}
                  </div>
                ))
              )}
            </div>

            {/* Rule badges layer */}
            {puzzle.regions.map(region => {
              const bounds = getRegionBounds(region.id);
              if (!bounds) return null;
              
              const color = getRegionColor(region.id);
              const label = formatRuleLabel(region.rule);
              
              // Position badge at right edge of the rightmost cell, vertically centered
              const cellSizePercent = 100 / puzzle.gridSize;
              const badgeTop = ((bounds.minRow + bounds.maxRow + 1) / 2) * cellSizePercent;
              const badgeLeft = (bounds.maxCol + 1) * cellSizePercent;
              
              return (
                <div
                  key={`badge-${region.id}`}
                  className="absolute pointer-events-none z-20"
                  style={{
                    top: `${badgeTop}%`,
                    left: `${badgeLeft}%`,
                    transform: 'translate(-50%, -50%)',
                  }}
                >
                  <div 
                    className="w-6 h-6 rounded-md text-white transform rotate-45 flex items-center justify-center print:w-8 print:h-8"
                    style={{
                      backgroundColor: color.bg,
                    }}
                  >
                    <span className="transform -rotate-45 text-xs font-bold print:text-base">
                      {label}
                    </span>
                  </div>
                </div>
              );
            })}
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
                  : `Sum ≤ ${region.rule.value}`;
              
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
              The sum of pips in each region must satisfy its constraint (≥ or ≤).
            </li>
            <li>Use all available dominoes exactly once.</li>
          </ol>
        </div>
      </div>

      {/* Print-specific styles */}
      <style>{`
        @media print {
          @page {
            margin: 1cm;
            size: letter;
          }
          body {
            background: white;
          }
          .print\\:hidden {
            display: none;
          }
          .print\\:page-break-after-always {
            page-break-after: always;
          }
          .print\\:page-break-before-always {
            page-break-before: always;
          }
        }
      `}</style>
    </div>
  );
};

export default Print;

