import { useCallback, useMemo, memo } from 'react';
import type { Puzzle, CellPosition, Placement, ValidationResult } from '../types/puzzle';
import { buildCellLookup } from '../types/puzzle';
import { buildPlacementLookup, getPlacementForCellFromMap } from '../engine/placementUtils';
import { getDominoForPlacement } from '../engine/dominoUtils';
import { useDragHandling } from '../hooks/useDragHandling';
import RegionComponent from './Region';
import DominoTile from './DominoTile';
import DroppableCell from './DroppableCell';
import DraggableDomino from './DraggableDomino';

interface BoardProps {
  puzzle: Puzzle;
  placementMode: 'select-domino' | 'place-first' | 'place-second';
  firstCell: CellPosition | null;
  validationResult: ValidationResult | null;
  onCellClick: (row: number, col: number) => void;
  onMovePlacement: (fromRow: number, fromCol: number, toRow: number, toCol: number) => void;
}

const Board = ({ 
  puzzle, 
  placementMode, 
  firstCell, 
  validationResult, 
  onCellClick,
  onMovePlacement,
}: BoardProps) => {
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
  
  // Memoize cell lookup map - only recalculate when puzzle.cells changes
  const cellMap = useMemo(() => buildCellLookup(puzzle), [puzzle.cells]);
  
  // Memoize placement lookup map for O(1) access - only recalculate when placements change
  const placementLookup = useMemo(() => buildPlacementLookup(puzzle.placements), [puzzle.placements]);

  // Get placement covering a cell using memoized lookup map (O(1))
  const getPlacement = useCallback((row: number, col: number): Placement | undefined => {
    return getPlacementForCellFromMap(row, col, placementLookup);
  }, [placementLookup]);

  // Calculate responsive cell size (must be before useDragHandling)
  const cellSize = useMemo(() => {
    // Base size, but make it responsive
    const baseSize = 60;
    const maxWidth = 800; // Max container width
    const calculatedWidth = bounds.width * baseSize;
    if (calculatedWidth > maxWidth) {
      return Math.floor(maxWidth / bounds.width);
    }
    return baseSize;
  }, [bounds.width]);

  // Use custom hook for drag handling
  const { dragState, boardRef, handleDragStart } = useDragHandling({
    bounds,
    cellSize,
    cellMap,
    getPlacement,
    onMovePlacement,
  });

  // Memoize region lookup for validation
  const regionLookup = useMemo(() => {
    const lookup = new Map<string, string>(); // cell key -> region id
    for (const region of puzzle.regions) {
      for (const cell of region.cells) {
        lookup.set(`${cell.row}-${cell.col}`, region.id);
      }
    }
    return lookup;
  }, [puzzle.regions]);

  // Check if cell is invalid (part of invalid region) - memoized
  const isCellInvalid = useCallback((row: number, col: number): boolean => {
    if (!validationResult || validationResult.isValid) return false;
    const regionId = regionLookup.get(`${row}-${col}`);
    return regionId ? validationResult.invalidRegions.includes(regionId) : false;
  }, [validationResult, regionLookup]);

  // Check if cell is highlighted (first cell in placement mode) - memoized
  const isCellHighlighted = useCallback((row: number, col: number): boolean => {
    return (
      placementMode === 'place-second' &&
      firstCell !== null &&
      firstCell.row === row &&
      firstCell.col === col
    );
  }, [placementMode, firstCell]);

  // Check if cell can be clicked for placement - memoized
  const isCellClickable = useCallback((row: number, col: number): boolean => {
    if (placementMode === 'select-domino') return false;
    const placement = getPlacement(row, col);
    return !placement || placement.fixed !== true;
  }, [placementMode, getPlacement]);

  const handleCellClick = useCallback((row: number, col: number) => {
    // Don't trigger click if we just finished dragging
    if (dragState.isDragging) {
      return;
    }
    onCellClick(row, col);
  }, [dragState.isDragging, onCellClick]);
  
  const containerWidth = bounds.width * cellSize;
  const containerHeight = bounds.height * cellSize;
  
  // Helper to check if a cell is on the outer edge of the puzzle shape
  const isOuterEdge = useCallback((row: number, col: number, side: 'top' | 'right' | 'bottom' | 'left'): boolean => {
    const neighbors = {
      top: cellMap.has(`${row - 1}-${col}`),
      right: cellMap.has(`${row}-${col + 1}`),
      bottom: cellMap.has(`${row + 1}-${col}`),
      left: cellMap.has(`${row}-${col - 1}`),
    };
    return !neighbors[side];
  }, [cellMap]);
  
  // Helper to get border radius for a cell
  const getBorderRadius = useCallback((row: number, col: number): string => {
    const topLeft = isOuterEdge(row, col, 'top') && isOuterEdge(row, col, 'left');
    const topRight = isOuterEdge(row, col, 'top') && isOuterEdge(row, col, 'right');
    const bottomLeft = isOuterEdge(row, col, 'bottom') && isOuterEdge(row, col, 'left');
    const bottomRight = isOuterEdge(row, col, 'bottom') && isOuterEdge(row, col, 'right');
    
    return `${topLeft ? '0.375rem' : '0'} ${topRight ? '0.375rem' : '0'} ${bottomRight ? '0.375rem' : '0'} ${bottomLeft ? '0.375rem' : '0'}`;
  }, [isOuterEdge]);

  return (
    <div className="w-full max-w-4xl mx-auto">
      <div className="bg-white rounded-lg shadow-md p-2 sm:p-4 overflow-visible">
        <div 
          className="relative mx-auto"
          style={{ 
            width: `${containerWidth}px`,
            height: `${containerHeight}px`,
            minWidth: '200px',
            minHeight: '200px',
          }} 
          ref={boardRef}
        >
            {/* Background tan/beige squares layer - separate layer like NYT, extends beyond colored regions */}
            {puzzle.cells.map(cell => {
              const { row, col } = cell;
              const relativeRow = row - bounds.minRow;
              const relativeCol = col - bounds.minCol;
              const padding = cellSize * 0.10; // Extend tan squares 10% beyond colored regions
              const left = relativeCol * cellSize - padding;
              const top = relativeRow * cellSize - padding;
              const size = cellSize + (padding * 2); // Make tan squares larger
              
              return (
                <div
                  key={`bg-${row}-${col}`}
                  className="absolute pointer-events-none"
                  style={{
                    left: `${left}px`,
                    top: `${top}px`,
                    width: `${size}px`,
                    height: `${size}px`,
                    backgroundColor: '#e8dcc6', // beige/tan color - slightly darker for visibility
                    borderRadius: getBorderRadius(row, col),
                    zIndex: 0,
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
              />
            ))}

            {/* Interactive cells layer - only render cells that exist */}
            {puzzle.cells.map(cell => {
                  const { row, col } = cell;
                  const placement = getPlacement(row, col);
                  const isInvalid = isCellInvalid(row, col);
                  const isHighlighted = isCellHighlighted(row, col);
                  const isClickable = isCellClickable(row, col);
                  
                  // Check if this cell is part of the dragged placement
                  const isDragged = dragState.isDragging && 
                    dragState.draggedPlacement &&
                    placement &&
                    placement.dominoId === dragState.draggedPlacement.dominoId;
                  
                  // Check if this is the drop target
                  const isDropTarget = dragState.isDragging && 
                    dragState.currentRow === row && 
                    dragState.currentCol === col &&
                    !isDragged;
                  
                  // Check if this cell can be dragged
                  const isDraggable = placement !== undefined;

                  const cellId = `cell-${row}-${col}`;
                  
                  // Calculate absolute position relative to bounding box
                  const relativeRow = row - bounds.minRow;
                  const relativeCol = col - bounds.minCol;
                  const left = relativeCol * cellSize;
                  const top = relativeRow * cellSize;

                  return (
                    <div
                      key={cellId}
                    style={{
                      position: 'absolute',
                      left: `${left}px`,
                      top: `${top}px`,
                      width: `${cellSize}px`,
                      height: `${cellSize}px`,
                      borderRadius: getBorderRadius(row, col),
                      zIndex: 8, // Below region borders but above region backgrounds
                    }}
                    >
                      <DroppableCell
                        id={cellId}
                        className={`
                          w-full h-full
                          relative
                          ${isInvalid ? 'bg-red-100' : ''}
                          ${isHighlighted ? 'bg-yellow-200 ring-2 ring-yellow-400' : ''}
                          ${isDropTarget ? 'bg-blue-100 ring-2 ring-blue-400' : ''}
                          ${isClickable && placementMode !== 'select-domino' ? 'cursor-pointer hover:bg-gray-50 active:bg-gray-100 touch-manipulation' : ''}
                          ${isDraggable ? 'cursor-grab active:cursor-grabbing' : ''}
                          ${isDragged ? 'opacity-50' : ''}
                          flex items-center justify-center
                          transition-colors
                          z-10
                        `}
                        style={{
                          backgroundColor: 'transparent', // Transparent so tan squares and colored regions show through
                        }}
                      >
                      {/* Inner lighter tan square to show cell boundaries */}
                      {!isInvalid && !isHighlighted && !isDropTarget && (
                        <div
                          className="absolute pointer-events-none"
                          style={{
                            left: '2px',
                            top: '2px',
                            right: '2px',
                            bottom: '2px',
                            backgroundColor: '#f5f0e6', // Lighter tan for inner square
                            borderRadius: '2px',
                            zIndex: 1,
                          }}
                        />
                      )}
                      <div
                        onClick={() => handleCellClick(row, col)}
                        onMouseDown={(e) => {
                          if (isDraggable) {
                            handleDragStart(e, row, col);
                          }
                        }}
                        onTouchStart={(e) => {
                          // Prevent double-tap zoom on mobile
                          if (e.touches.length > 1) {
                            e.preventDefault();
                          }
                          if (isDraggable) {
                            handleDragStart(e, row, col);
                          }
                        }}
                        className="w-full h-full flex items-center justify-center"
                        role="button"
                        tabIndex={isClickable && placementMode !== 'select-domino' ? 0 : -1}
                        aria-label={`Cell at row ${row + 1}, column ${col + 1}`}
                        onKeyDown={(e) => {
                          if ((e.key === 'Enter' || e.key === ' ') && isClickable && placementMode !== 'select-domino') {
                            e.preventDefault();
                            handleCellClick(row, col);
                          }
                        }}
                      >
                        <div className="text-[10px] sm:text-xs text-gray-400">
                          {isHighlighted ? '✓' : ''}
                        </div>
                      </div>
                    </DroppableCell>
                    </div>
                  );
                })}

            {/* Domino overlay layer */}
            {puzzle.placements.map(placement => {
                const domino = getDominoForPlacement(placement.dominoId, puzzle.availableDominoes);
                if (!domino) return null;

                const { row, col, orientation } = placement;
                
                // Calculate absolute position for domino
                const relativeRow = row - bounds.minRow;
                const relativeCol = col - bounds.minCol;
                const left = relativeCol * cellSize;
                const top = relativeRow * cellSize;

                const areaStyles: React.CSSProperties =
                  orientation === 'horizontal'
                    ? {
                        position: 'absolute',
                        left: `${left}px`,
                        top: `${top}px`,
                        width: `${cellSize * 2}px`,
                        height: `${cellSize}px`,
                      }
                    : {
                        position: 'absolute',
                        left: `${left}px`,
                        top: `${top}px`,
                        width: `${cellSize}px`,
                        height: `${cellSize * 2}px`,
                      };

                // Check if this placement is being dragged
                const isDraggedPlacement = dragState.isDragging && 
                  dragState.draggedPlacement &&
                  dragState.draggedPlacement.dominoId === placement.dominoId;

                return (
                  <div
                    key={placement.id}
                    style={areaStyles}
                    className={`flex items-center justify-center p-1 sm:p-1.5 pointer-events-auto z-20 ${isDraggedPlacement ? 'opacity-50' : ''}`}
                  >
                    <DraggableDomino
                      id={`placement-${placement.dominoId}`}
                      data={{ type: 'board', placementId: placement.dominoId }}
                      className="w-full h-full"
                    >
                      <DominoTile
                        left={domino.left}
                        right={domino.right}
                        variant="board"
                        orientation={orientation}
                      />
                    </DraggableDomino>
                  </div>
                );
              })}
        </div>
      </div>
    </div>
  );
};

export default memo(Board);

