// Board rendering utilities

import type { Puzzle } from '../../types/puzzle';

/**
 * Calculate board bounds from puzzle cells
 */
export function calculateBoardBounds(puzzle: Puzzle): {
  minRow: number;
  maxRow: number;
  minCol: number;
  maxCol: number;
  width: number;
  height: number;
} {
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
}

/**
 * Calculate responsive cell size
 */
export function calculateCellSize(bounds: { width: number }): number {
  const baseSize = 90;
  const maxWidth = 1400;
  const calculatedWidth = bounds.width * baseSize;
  
  if (calculatedWidth > maxWidth) {
    return Math.floor(maxWidth / bounds.width);
  }
  
  return baseSize;
}

