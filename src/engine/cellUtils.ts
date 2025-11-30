import type { CellPosition } from '../types/puzzle';

/**
 * Cell utilities aligned with brianberns/Pips Cell module.
 */

/**
 * Gets all possible cells adjacent to the given cell.
 * Returns all 4 neighbors (up, down, left, right).
 * Some of these cells might not actually exist on the board (out of bounds).
 * 
 * Aligned with brianberns/Pips:
 * let getAdjacent cell =
 *   [|
 *     { cell with Row = cell.Row - 1 }
 *     { cell with Row = cell.Row + 1 }
 *     { cell with Column = cell.Column - 1 }
 *     { cell with Column = cell.Column + 1 }
 *   |]
 */
export const getAdjacentCells = (cell: CellPosition): CellPosition[] => {
  return [
    { row: cell.row - 1, col: cell.col }, // up
    { row: cell.row + 1, col: cell.col }, // down
    { row: cell.row, col: cell.col - 1 }, // left
    { row: cell.row, col: cell.col + 1 }, // right
  ];
};

/**
 * Generate a consistent string key for a cell position.
 * Format: "row-col"
 * 
 * @param cell - The cell position
 * @returns A string key for the cell
 */
export const cellToKey = (cell: CellPosition): string => {
  return `${cell.row}-${cell.col}`;
};

/**
 * Parse a cell key back into a CellPosition.
 * 
 * @param key - The cell key in format "row-col"
 * @returns The cell position, or null if invalid
 */
export const keyToCell = (key: string): CellPosition | null => {
  const parts = key.split('-');
  if (parts.length !== 2) {
    return null;
  }
  
  const row = parseInt(parts[0], 10);
  const col = parseInt(parts[1], 10);
  
  if (isNaN(row) || isNaN(col)) {
    return null;
  }
  
  return { row, col };
};

/**
 * Check if two cell positions are equal.
 */
export const cellsEqual = (cell1: CellPosition, cell2: CellPosition): boolean => {
  return cell1.row === cell2.row && cell1.col === cell2.col;
};

