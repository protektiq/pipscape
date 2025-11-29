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

  // Gap between cells
  const cellGap = 1; // 1px gap between cells
  
  // Calculate responsive cell size (must be before useDragHandling)
  const cellSize = useMemo(() => {
    // Base size, but make it responsive
    const baseSize = 90;
    const maxWidth = 1400; // Max container width
    // Account for gaps in total width calculation
    const calculatedWidth = bounds.width * baseSize + (bounds.width - 1) * cellGap;
    if (calculatedWidth > maxWidth) {
      // Calculate cell size accounting for gaps
      return Math.floor((maxWidth - (bounds.width - 1) * cellGap) / bounds.width);
    }
    return baseSize;
  }, [bounds.width]);

  // Use custom hook for drag handling
  const { dragState, boardRef, handleDragStart } = useDragHandling({
    bounds,
    cellSize,
    cellGap,
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
  
  // Container size accounting for gaps between cells
  const containerWidth = bounds.width * cellSize + (bounds.width - 1) * cellGap;
  const containerHeight = bounds.height * cellSize + (bounds.height - 1) * cellGap;
  
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
      <div className="frosted-glass rounded-2xl shadow-card p-3 sm:p-6 overflow-visible">
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
            {/* Frosted glass background cells - more visible */}
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
                    backgroundColor: 'rgba(255, 255, 255, 0.8)',
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
                cellGap={cellGap}
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
                  
                  // Check if this is the drop target (with snap-to-grid)
                  const isDropTarget = dragState.isDragging && 
                    dragState.currentRow === row && 
                    dragState.currentCol === col &&
                    !isDragged;
                  
                  // Check if this is a valid drop location (for highlighting)
                  // Note: Valid drop logic would require checking placement validity
                  // For now, we'll use isDropTarget for visual feedback
                  
                  // Check if this cell can be dragged
                  const isDraggable = placement !== undefined;

                  const cellId = `cell-${row}-${col}`;
                  
                  // Calculate absolute position relative to bounding box (accounting for gaps)
                  const relativeRow = row - bounds.minRow;
                  const relativeCol = col - bounds.minCol;
                  const left = relativeCol * (cellSize + cellGap);
                  const top = relativeRow * (cellSize + cellGap);

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
                          ${isInvalid ? 'bg-red-100/50' : ''}
                          ${isHighlighted ? 'bg-yellow-200/60 ring-2 ring-yellow-400/50' : ''}
                          ${isDropTarget ? 'bg-blue-100/60 ring-2 ring-blue-400/50 shadow-lg' : ''}
                          ${isClickable && placementMode !== 'select-domino' ? 'cursor-pointer hover:bg-white/20 active:bg-white/30 touch-manipulation' : ''}
                          ${isDraggable ? 'cursor-grab active:cursor-grabbing' : ''}
                          ${isDragged ? 'opacity-50' : ''}
                          flex items-center justify-center
                          transition-all duration-200
                          z-10
                        `}
                        style={{
                          backgroundColor: 'transparent',
                        }}
                      >
                      {/* Soft 1px inset lines for cell boundaries */}
                      {!isInvalid && !isHighlighted && !isDropTarget && (
                        <div
                          className="absolute pointer-events-none inset-0"
                          style={{
                            border: '1px solid rgba(229, 231, 235, 0.5)',
                            borderRadius: getBorderRadius(row, col),
                            boxShadow: 'inset 0 0 0 1px rgba(0, 0, 0, 0.03)',
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
            {puzzle.placements.map((placement, index) => {
                const domino = getDominoForPlacement(placement.dominoId, puzzle.availableDominoes);
                if (!domino) return null;

                const { row, col, orientation } = placement;
                
                // Calculate absolute position for domino (accounting for gaps)
                const relativeRow = row - bounds.minRow;
                const relativeCol = col - bounds.minCol;
                const left = relativeCol * (cellSize + cellGap);
                const top = relativeRow * (cellSize + cellGap);

                const areaStyles: React.CSSProperties =
                  orientation === 'horizontal'
                    ? {
                        position: 'absolute',
                        left: `${left}px`,
                        top: `${top}px`,
                        width: `${cellSize * 2 + cellGap}px`,
                        height: `${cellSize}px`,
                        // Smooth animation for solve
                        transition: 'all 600ms cubic-bezier(0.4, 0, 0.2, 1)',
                        transitionDelay: `${index * 50}ms`, // Stagger animations
                      }
                    : {
                        position: 'absolute',
                        left: `${left}px`,
                        top: `${top}px`,
                        width: `${cellSize}px`,
                        height: `${cellSize * 2 + cellGap}px`,
                        // Smooth animation for solve
                        transition: 'all 600ms cubic-bezier(0.4, 0, 0.2, 1)',
                        transitionDelay: `${index * 50}ms`, // Stagger animations
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

