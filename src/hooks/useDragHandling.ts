import { useState, useRef, useEffect, useCallback } from 'react';
import type { Placement } from '../types/puzzle';

interface DragState {
  isDragging: boolean;
  draggedPlacement: Placement | null;
  startRow: number;
  startCol: number;
  currentRow: number | null;
  currentCol: number | null;
}

interface UseDragHandlingOptions {
  bounds: { minRow: number; maxRow: number; minCol: number; maxCol: number };
  cellSize: number;
  cellMap: Map<string, unknown>;
  getPlacement: (row: number, col: number) => Placement | undefined;
  onMovePlacement: (fromRow: number, fromCol: number, toRow: number, toCol: number) => void;
}

export const useDragHandling = ({
  bounds,
  cellSize,
  cellMap,
  getPlacement,
  onMovePlacement,
}: UseDragHandlingOptions) => {
  const [dragState, setDragState] = useState<DragState>({
    isDragging: false,
    draggedPlacement: null,
    startRow: -1,
    startCol: -1,
    currentRow: null,
    currentCol: null,
  });

  const boardRef = useRef<HTMLDivElement>(null);

  // Convert client coordinates to cell coordinates using absolute positioning
  const getCellFromCoordinates = useCallback(
    (clientX: number, clientY: number): { row: number; col: number } | null => {
      if (!boardRef.current) return null;

      const rect = boardRef.current.getBoundingClientRect();
      const relativeX = clientX - rect.left;
      const relativeY = clientY - rect.top;

      // Calculate which cell the coordinates fall into
      const relativeCol = Math.floor(relativeX / cellSize);
      const relativeRow = Math.floor(relativeY / cellSize);

      // Convert back to absolute coordinates
      const col = relativeCol + bounds.minCol;
      const row = relativeRow + bounds.minRow;

      // Check if cell exists
      const key = `${row}-${col}`;
      if (cellMap.has(key)) {
        return { row, col };
      }

      return null;
    },
    [bounds, cellSize, cellMap]
  );

  const handleDragStart = useCallback(
    (e: React.MouseEvent<HTMLDivElement> | React.TouchEvent<HTMLDivElement>, row: number, col: number) => {
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
    },
    [getPlacement]
  );

  // Set up global mouse/touch event listeners for dragging
  useEffect(() => {
    if (!dragState.isDragging) return;

    const handleMouseMove = (e: MouseEvent) => {
      const clientX = e.clientX;
      const clientY = e.clientY;
      const cell = getCellFromCoordinates(clientX, clientY);
      if (cell) {
        setDragState((prev) => ({
          ...prev,
          currentRow: cell.row,
          currentCol: cell.col,
        }));
      }
    };

    const handleMouseUp = () => {
      setDragState((prev) => {
        const { startRow, startCol, currentRow, currentCol } = prev;
        if (currentRow !== null && currentCol !== null && (currentRow !== startRow || currentCol !== startCol)) {
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
        setDragState((prev) => ({
          ...prev,
          currentRow: cell.row,
          currentCol: cell.col,
        }));
      }
    };

    const handleTouchEnd = (e: TouchEvent) => {
      e.preventDefault();
      setDragState((prev) => {
        const { startRow, startCol, currentRow, currentCol } = prev;
        if (currentRow !== null && currentCol !== null && (currentRow !== startRow || currentCol !== startCol)) {
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

  return {
    dragState,
    boardRef,
    handleDragStart,
  };
};

