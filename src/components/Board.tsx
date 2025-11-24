import { useState, useRef, useEffect, useCallback } from 'react';
import type { Puzzle, CellPosition, Placement, ValidationResult } from '../types/puzzle';
import { buildCellLookup } from '../types/puzzle';
import { getPlacementForCell } from '../engine/placementUtils';
import { getDominoForPlacement } from '../engine/dominoUtils';
import { getRegionForCell } from '../engine/regionUtils';
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
  const rows = puzzle.rows;
  const cols = puzzle.cols;
  const cellMap = buildCellLookup(puzzle);
  
  // Drag state
  const [dragState, setDragState] = useState<{
    isDragging: boolean;
    draggedPlacement: Placement | null;
    startRow: number;
    startCol: number;
    currentRow: number | null;
    currentCol: number | null;
  }>({
    isDragging: false,
    draggedPlacement: null,
    startRow: -1,
    startCol: -1,
    currentRow: null,
    currentCol: null,
  });
  
  const boardRef = useRef<HTMLDivElement>(null);

  // Get placement covering a cell
  const getPlacement = (row: number, col: number): Placement | undefined => {
    return getPlacementForCell(row, col, puzzle.placements);
  };

  // Check if cell is invalid (part of invalid region)
  const isCellInvalid = (row: number, col: number): boolean => {
    if (!validationResult || validationResult.isValid) return false;
    const region = getRegionForCell(row, col, puzzle.regions);
    return region ? validationResult.invalidRegions.includes(region.id) : false;
  };

  // Check if cell is highlighted (first cell in placement mode)
  const isCellHighlighted = (row: number, col: number): boolean => {
    return (
      placementMode === 'place-second' &&
      firstCell !== null &&
      firstCell.row === row &&
      firstCell.col === col
    );
  };

  // Check if cell can be clicked for placement
  const isCellClickable = (row: number, col: number): boolean => {
    if (placementMode === 'select-domino') return false;
    const placement = getPlacement(row, col);
    return !placement || placement.fixed !== true;
  };

  const handleCellClick = (row: number, col: number) => {
    // Don't trigger click if we just finished dragging
    if (dragState.isDragging) {
      return;
    }
    onCellClick(row, col);
  };

  // Convert client coordinates to grid cell coordinates
  const getCellFromCoordinates = useCallback((clientX: number, clientY: number): { row: number; col: number } | null => {
    if (!boardRef.current) return null;
    
    const rect = boardRef.current.getBoundingClientRect();
    const relativeX = clientX - rect.left;
    const relativeY = clientY - rect.top;
    
    const cellWidth = rect.width / cols;
    const cellHeight = rect.height / rows;
    
    const col = Math.floor(relativeX / cellWidth);
    const row = Math.floor(relativeY / cellHeight);
    
    if (row >= 0 && row < rows && col >= 0 && col < cols) {
      // Only return if the cell exists (for sparse grids)
      const key = `${row}-${col}`;
      if (cellMap.has(key)) {
        return { row, col };
      }
    }
    
    return null;
  }, [rows, cols, cellMap]);

  const handleDragStart = (e: React.MouseEvent<HTMLDivElement> | React.TouchEvent<HTMLDivElement>, row: number, col: number) => {
    const placement = getPlacement(row, col);
    if (!placement) return;
    
    e.preventDefault();
    e.stopPropagation();
    
    setDragState({
      isDragging: true,
      draggedPlacement: placement,
      startRow: row,
      startCol: col,
      currentRow: row,
      currentCol: col,
    });
  };


  // Set up global mouse/touch event listeners for dragging
  useEffect(() => {
    if (!dragState.isDragging) return;
    
    const handleMouseMove = (e: MouseEvent) => {
      const clientX = e.clientX;
      const clientY = e.clientY;
      const cell = getCellFromCoordinates(clientX, clientY);
      if (cell) {
        setDragState(prev => ({
          ...prev,
          currentRow: cell.row,
          currentCol: cell.col,
        }));
      }
    };
    
    const handleMouseUp = () => {
      setDragState(prev => {
        const { startRow, startCol, currentRow, currentCol } = prev;
        if (currentRow !== null && currentCol !== null && 
            (currentRow !== startRow || currentCol !== startCol)) {
          onMovePlacement(startRow, startCol, currentRow, currentCol);
        }
        return {
          isDragging: false,
          draggedPlacement: null,
          startRow: -1,
          startCol: -1,
          currentRow: null,
          currentCol: null,
        };
      });
    };
    
    const handleTouchMove = (e: TouchEvent) => {
      e.preventDefault();
      if (e.touches.length === 0) return;
      const touch = e.touches[0];
      const cell = getCellFromCoordinates(touch.clientX, touch.clientY);
      if (cell) {
        setDragState(prev => ({
          ...prev,
          currentRow: cell.row,
          currentCol: cell.col,
        }));
      }
    };
    
    const handleTouchEnd = (e: TouchEvent) => {
      e.preventDefault();
      setDragState(prev => {
        const { startRow, startCol, currentRow, currentCol } = prev;
        if (currentRow !== null && currentCol !== null && 
            (currentRow !== startRow || currentCol !== startCol)) {
          onMovePlacement(startRow, startCol, currentRow, currentCol);
        }
        return {
          isDragging: false,
          draggedPlacement: null,
          startRow: -1,
          startCol: -1,
          currentRow: null,
          currentCol: null,
        };
      });
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    window.addEventListener('touchmove', handleTouchMove, { passive: false });
    window.addEventListener('touchend', handleTouchEnd);
    window.addEventListener('touchcancel', handleTouchEnd);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleTouchEnd);
      window.removeEventListener('touchcancel', handleTouchEnd);
    };
  }, [dragState.isDragging, onMovePlacement, getCellFromCoordinates]);

  return (
    <div className="w-full max-w-4xl mx-auto">
      <div className="bg-white rounded-lg shadow-md p-2 sm:p-4 overflow-visible">
        <div className="relative w-full" style={{ paddingBottom: '100%' }} ref={boardRef}>
          <div className="absolute inset-0">
            {/* Background grid layer */}
            <div
              className="grid gap-0 border-2 border-gray-300 bg-white h-full"
              style={{
                gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))`,
                gridTemplateRows: `repeat(${rows}, minmax(0, 1fr))`,
              }}
            >
              {Array.from({ length: rows }).map((_, row) =>
                Array.from({ length: cols }).map((_, col) => {
                  const key = `${row}-${col}`;
                  const cellExists = cellMap.has(key);
                  return (
                    <div
                      key={`bg-${row}-${col}`}
                      className={`aspect-square border-r border-b border-gray-200 pointer-events-none ${
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

            {/* Interactive cells layer */}
            <div
              className="grid gap-0 absolute inset-0"
              style={{
                gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))`,
                gridTemplateRows: `repeat(${rows}, minmax(0, 1fr))`,
              }}
            >
              {Array.from({ length: rows }).map((_, row) =>
                Array.from({ length: cols }).map((_, col) => {
                  const key = `${row}-${col}`;
                  const cell = cellMap.get(key);
                  
                  // If cell doesn't exist, render transparent spacer
                  if (!cell) {
                    return (
                      <div
                        key={`spacer-${row}-${col}`}
                        className="bg-transparent pointer-events-none"
                      />
                    );
                  }
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

                  return (
                    <DroppableCell
                      key={cellId}
                      id={cellId}
                      className={`
                        aspect-square
                        ${isInvalid ? 'bg-red-100' : ''}
                        ${isHighlighted ? 'bg-yellow-200 ring-2 ring-yellow-400' : ''}
                        ${isDropTarget ? 'bg-blue-100 ring-2 ring-blue-400' : ''}
                        ${isClickable && placementMode !== 'select-domino' ? 'cursor-pointer hover:bg-gray-100 active:bg-gray-200 touch-manipulation' : ''}
                        ${isDraggable ? 'cursor-grab active:cursor-grabbing' : ''}
                        ${isDragged ? 'opacity-50' : ''}
                        flex items-center justify-center
                        transition-colors
                        relative z-10
                        min-h-[44px] min-w-[44px]
                      `}
                    >
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
                  );
                })
              )}
            </div>

            {/* Domino overlay layer */}
            <div
              className="pointer-events-none absolute inset-0 grid"
              style={{
                gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))`,
                gridTemplateRows: `repeat(${rows}, minmax(0, 1fr))`,
              }}
            >
              {puzzle.placements.map(placement => {
                const domino = getDominoForPlacement(placement.dominoId, puzzle.availableDominoes);
                if (!domino) return null;

                const { row, col, orientation } = placement;

                const areaStyles: React.CSSProperties =
                  orientation === 'horizontal'
                    ? {
                        gridRowStart: row + 1,
                        gridRowEnd: row + 2,
                        gridColumnStart: col + 1,
                        gridColumnEnd: col + 3, // span 2 columns
                      }
                    : {
                        gridRowStart: row + 1,
                        gridRowEnd: row + 3, // span 2 rows
                        gridColumnStart: col + 1,
                        gridColumnEnd: col + 2,
                      };

                // Check if this placement is being dragged
                const isDragged = dragState.isDragging && 
                  dragState.draggedPlacement &&
                  dragState.draggedPlacement.dominoId === placement.dominoId;

                return (
                  <div
                    key={placement.id}
                    style={areaStyles}
                    className={`flex items-center justify-center p-1 sm:p-1.5 pointer-events-auto ${isDragged ? 'opacity-50' : ''}`}
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
      </div>
    </div>
  );
};

export default Board;

