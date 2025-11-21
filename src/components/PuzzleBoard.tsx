import { usePuzzleStore } from '../store/puzzleStore';
import { GRID_SIZE, type RegionRule } from '../types/puzzle';

// Region color palette with RGB values for inline styles
const REGION_COLORS = [
  { name: 'blue', bg: 'rgb(59, 130, 246)', border: 'rgb(37, 99, 235)' },      // blue-500, blue-600
  { name: 'green', bg: 'rgb(34, 197, 94)', border: 'rgb(22, 163, 74)' },     // green-500, green-600
  { name: 'purple', bg: 'rgb(168, 85, 247)', border: 'rgb(147, 51, 234)' }, // purple-500, purple-600
  { name: 'orange', bg: 'rgb(249, 115, 22)', border: 'rgb(234, 88, 12)' },  // orange-500, orange-600
  { name: 'pink', bg: 'rgb(236, 72, 153)', border: 'rgb(219, 39, 119)' },   // pink-500, pink-600
  { name: 'teal', bg: 'rgb(20, 184, 166)', border: 'rgb(15, 118, 110)' },    // teal-500, teal-600
  { name: 'amber', bg: 'rgb(245, 158, 11)', border: 'rgb(217, 119, 6)' },   // amber-500, amber-600
  { name: 'indigo', bg: 'rgb(99, 102, 241)', border: 'rgb(79, 70, 229)' },  // indigo-500, indigo-600
  { name: 'rose', bg: 'rgb(244, 63, 94)', border: 'rgb(225, 29, 72)' },      // rose-500, rose-600
  { name: 'cyan', bg: 'rgb(6, 182, 212)', border: 'rgb(8, 145, 178)' },      // cyan-500, cyan-600
];

// Generate consistent color from region ID
const getRegionColor = (regionId: string) => {
  // Simple hash function to get consistent color index
  let hash = 0;
  for (let i = 0; i < regionId.length; i++) {
    hash = ((hash << 5) - hash) + regionId.charCodeAt(i);
    hash = hash & hash; // Convert to 32-bit integer
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
const isCellInRegion = (row: number, col: number, regionId: string, regions: any[]): boolean => {
  const region = regions.find(r => r.id === regionId);
  if (!region) return false;
  return region.cells.some((cell: any) => cell.row === row && cell.col === col);
};

// Get boundary edge information for a cell
const getRegionEdgeInfo = (
  row: number, 
  col: number, 
  regionId: string,
  regions: any[]
): EdgeInfo => {
  const top = row === 0 || !isCellInRegion(row - 1, col, regionId, regions);
  const right = col === GRID_SIZE - 1 || !isCellInRegion(row, col + 1, regionId, regions);
  const bottom = row === GRID_SIZE - 1 || !isCellInRegion(row + 1, col, regionId, regions);
  const left = col === 0 || !isCellInRegion(row, col - 1, regionId, regions);
  
  return { top, right, bottom, left };
};

// Check if a corner is an outer corner (convex corner)
const isOuterCorner = (
  row: number,
  col: number,
  regionId: string,
  regions: any[],
  corner: 'tl' | 'tr' | 'bl' | 'br'
): boolean => {
  const edgeInfo = getRegionEdgeInfo(row, col, regionId, regions);
  
  if (corner === 'tl') {
    // Top-left corner: both top and left edges are boundaries
    // And diagonal cell (top-left) is not in region
    return edgeInfo.top && edgeInfo.left && 
           !isCellInRegion(row - 1, col - 1, regionId, regions);
  } else if (corner === 'tr') {
    // Top-right corner: both top and right edges are boundaries
    return edgeInfo.top && edgeInfo.right &&
           !isCellInRegion(row - 1, col + 1, regionId, regions);
  } else if (corner === 'bl') {
    // Bottom-left corner: both bottom and left edges are boundaries
    return edgeInfo.bottom && edgeInfo.left &&
           !isCellInRegion(row + 1, col - 1, regionId, regions);
  } else if (corner === 'br') {
    // Bottom-right corner: both bottom and right edges are boundaries
    return edgeInfo.bottom && edgeInfo.right &&
           !isCellInRegion(row + 1, col + 1, regionId, regions);
  }
  
  return false;
};

const PuzzleBoard = () => {
  const {
    currentPuzzle,
    placementMode,
    firstCell,
    validationResult,
    placeDomino,
    removePlacement,
  } = usePuzzleStore();

  if (!currentPuzzle) {
    return null;
  }

  // Get placement covering a cell
  const getPlacementForCell = (row: number, col: number) => {
    return currentPuzzle.placements.find(p => {
      const cells = getPlacementCells(p);
      return cells.some(c => c.row === row && c.col === col);
    });
  };

  // Get domino for a placement
  const getDominoForPlacement = (placementId: string) => {
    const placement = currentPuzzle.placements.find(p => p.dominoId === placementId);
    if (!placement) return null;
    return currentPuzzle.availableDominoes.find(d => d.id === placement.dominoId);
  };

  // Get region for a cell
  const getRegionForCell = (row: number, col: number) => {
    return currentPuzzle.regions.find(region =>
      region.cells.some(cell => cell.row === row && cell.col === col)
    );
  };

  // Check if cell is invalid (part of invalid region)
  const isCellInvalid = (row: number, col: number) => {
    if (!validationResult || validationResult.isValid) return false;
    const region = getRegionForCell(row, col);
    return region && validationResult.invalidRegions.includes(region.id);
  };

  // Check if cell is highlighted (first cell in placement mode)
  const isCellHighlighted = (row: number, col: number) => {
    return (
      placementMode === 'place-second' &&
      firstCell &&
      firstCell.row === row &&
      firstCell.col === col
    );
  };

  // Check if cell can be clicked for placement
  const isCellClickable = (row: number, col: number) => {
    if (placementMode === 'select-domino') return false;
    const placement = getPlacementForCell(row, col);
    return !placement || placement.fixed !== true;
  };

  const handleCellClick = (row: number, col: number) => {
    const placement = getPlacementForCell(row, col);
    
    if (placement && placementMode === 'select-domino') {
      // Remove placement on click when not in placement mode
      removePlacement(row, col);
    } else if (placementMode !== 'select-domino' && isCellClickable(row, col)) {
      // Place domino when in placement mode
      placeDomino({ row, col });
    }
  };

  // Render pips for a number (0-6)
  const renderPips = (count: number) => {
    if (count === 0) {
      return <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">0</div>;
    }

    // Simple pip representation
    const pipPositions: { [key: number]: string[] } = {
      1: ['center'],
      2: ['top-left', 'bottom-right'],
      3: ['top-left', 'center', 'bottom-right'],
      4: ['top-left', 'top-right', 'bottom-left', 'bottom-right'],
      5: ['top-left', 'top-right', 'center', 'bottom-left', 'bottom-right'],
      6: ['top-left', 'top-right', 'mid-left', 'mid-right', 'bottom-left', 'bottom-right'],
    };

    const positions = pipPositions[count] || [];

    return (
      <div className="grid grid-cols-3 gap-0.5 p-1 w-full h-full">
        {Array.from({ length: 9 }).map((_, i) => {
          const row = Math.floor(i / 3);
          const col = i % 3;
          let position = '';
          
          if (row === 0 && col === 0) position = 'top-left';
          else if (row === 0 && col === 1) position = 'top-center';
          else if (row === 0 && col === 2) position = 'top-right';
          else if (row === 1 && col === 0) position = 'mid-left';
          else if (row === 1 && col === 1) position = 'center';
          else if (row === 1 && col === 2) position = 'mid-right';
          else if (row === 2 && col === 0) position = 'bottom-left';
          else if (row === 2 && col === 1) position = 'bottom-center';
          else if (row === 2 && col === 2) position = 'bottom-right';

          const shouldShowPip = positions.includes(position);

          return (
            <div
              key={i}
              className={`aspect-square ${
                shouldShowPip ? 'bg-gray-900 rounded-full' : ''
              }`}
            />
          );
        })}
      </div>
    );
  };

  // Calculate region bounds for badge positioning
  const getRegionBounds = (regionId: string) => {
    const region = currentPuzzle.regions.find(r => r.id === regionId);
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
    <div className="w-full max-w-4xl mx-auto">
      <div className="bg-white rounded-lg shadow-md p-4 overflow-visible">
        <div className="relative">
          {/* Background grid layer */}
          <div
            className="grid gap-0 border-2 border-gray-300 bg-white"
            style={{
              gridTemplateColumns: `repeat(${GRID_SIZE}, minmax(0, 1fr))`,
            }}
          >
            {Array.from({ length: GRID_SIZE }).map((_, row) =>
              Array.from({ length: GRID_SIZE }).map((_, col) => (
                <div
                  key={`bg-${row}-${col}`}
                  className="aspect-square border-r border-b border-gray-200 pointer-events-none"
                />
              ))
            )}
          </div>

          {/* Region backgrounds layer */}
          {currentPuzzle.regions.map(region => {
            const color = getRegionColor(region.id);
            
            return (
              <div
                key={`region-bg-${region.id}`}
                className="absolute inset-0 pointer-events-none"
              >
                {region.cells.map(cell => {
                  const cellSize = `calc(100% / ${GRID_SIZE})`;
                  return (
                    <div
                      key={`bg-${cell.row}-${cell.col}`}
                      style={{
                        position: 'absolute',
                        top: `${(cell.row / GRID_SIZE) * 100}%`,
                        left: `${(cell.col / GRID_SIZE) * 100}%`,
                        width: cellSize,
                        height: cellSize,
                        backgroundColor: color.bg,
                        opacity: 0.2,
                      }}
                    />
                  );
                })}
              </div>
            );
          })}

          {/* Region borders layer */}
          {currentPuzzle.regions.map(region => {
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
                    region.id,
                    currentPuzzle.regions
                  );
                  
                  const cellSize = `calc(100% / ${GRID_SIZE})`;
                  const borderWidth = '2px';
                  const isOuterTL = isOuterCorner(cell.row, cell.col, region.id, currentPuzzle.regions, 'tl');
                  const isOuterTR = isOuterCorner(cell.row, cell.col, region.id, currentPuzzle.regions, 'tr');
                  const isOuterBL = isOuterCorner(cell.row, cell.col, region.id, currentPuzzle.regions, 'bl');
                  const isOuterBR = isOuterCorner(cell.row, cell.col, region.id, currentPuzzle.regions, 'br');
                  
                  return (
                    <div
                      key={`border-${cell.row}-${cell.col}`}
                      className="border-dashed"
                      style={{
                        position: 'absolute',
                        top: `${(cell.row / GRID_SIZE) * 100}%`,
                        left: `${(cell.col / GRID_SIZE) * 100}%`,
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
              gridTemplateColumns: `repeat(${GRID_SIZE}, minmax(0, 1fr))`,
            }}
          >
            {Array.from({ length: GRID_SIZE }).map((_, row) =>
              Array.from({ length: GRID_SIZE }).map((_, col) => {
                const placement = getPlacementForCell(row, col);
                const isInvalid = isCellInvalid(row, col);
                const isHighlighted = isCellHighlighted(row, col);
                const isClickable = isCellClickable(row, col);

                // Determine if this is the first or second cell of a placement
                let cellType: 'first' | 'second' | 'none' = 'none';
                if (placement) {
                  const cells = getPlacementCells(placement);
                  if (cells[0].row === row && cells[0].col === col) {
                    cellType = 'first';
                  } else if (cells[1].row === row && cells[1].col === col) {
                    cellType = 'second';
                  }
                }

                const domino = placement ? getDominoForPlacement(placement.dominoId) : null;

                return (
                  <div
                    key={`${row}-${col}`}
                    onClick={() => handleCellClick(row, col)}
                    className={`
                      aspect-square
                      ${isInvalid ? 'bg-red-100' : ''}
                      ${isHighlighted ? 'bg-yellow-200 ring-2 ring-yellow-400' : ''}
                      ${isClickable && placementMode !== 'select-domino' ? 'cursor-pointer hover:bg-gray-100' : ''}
                      flex items-center justify-center
                      transition-colors
                      relative z-10
                    `}
                  >
                    {placement && domino ? (
                      <div className={`w-full h-full ${placement.orientation === 'horizontal' ? 'flex' : 'flex flex-col'}`}>
                        {cellType === 'first' ? (
                          <div className={`flex-1 flex items-center justify-center ${placement.orientation === 'horizontal' ? 'border-r border-gray-400' : 'border-b border-gray-400'}`}>
                            {renderPips(domino.left)}
                          </div>
                        ) : null}
                        {cellType === 'second' ? (
                          <div className="flex-1 flex items-center justify-center">
                            {renderPips(domino.right)}
                          </div>
                        ) : null}
                      </div>
                    ) : (
                      <div className="text-xs text-gray-400">
                        {isHighlighted ? '✓' : ''}
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>

          {/* Rule badges layer */}
          {currentPuzzle.regions.map(region => {
            const bounds = getRegionBounds(region.id);
            if (!bounds) return null;
            
            const color = getRegionColor(region.id);
            const label = formatRuleLabel(region.rule);
            
            // Position badge at right edge of the rightmost cell, vertically centered
            // Using percentage of grid size
            const cellSizePercent = 100 / GRID_SIZE;
            const badgeTop = ((bounds.minRow + bounds.maxRow + 1) / 2) * cellSizePercent;
            // Position at the right edge of the rightmost cell
            // Since we use translate(-50%, -50%), we position the center at the right edge
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
                  className="w-6 h-6 rounded-md text-white transform rotate-45 flex items-center justify-center"
                  style={{
                    backgroundColor: color.bg,
                  }}
                >
                  <span className="transform -rotate-45 text-xs font-bold">
                    {label}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

// Helper to get placement cells
const getPlacementCells = (placement: {
  row: number;
  col: number;
  orientation: 'horizontal' | 'vertical';
}) => {
  const cells = [{ row: placement.row, col: placement.col }];
  if (placement.orientation === 'horizontal') {
    cells.push({ row: placement.row, col: placement.col + 1 });
  } else {
    cells.push({ row: placement.row + 1, col: placement.col });
  }
  return cells;
};

export default PuzzleBoard;

