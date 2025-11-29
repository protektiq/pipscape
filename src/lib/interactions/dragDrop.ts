// Enhanced drag & drop utilities for Pipscape

import type { CellPosition, Placement, Puzzle } from '../../types/puzzle';
import { getPlacementCells } from '../../engine/placementUtils';
import { buildCellLookup } from '../../types/puzzle';

/**
 * Check if a placement is valid at a given position
 */
export function isValidDropLocation(
  puzzle: Puzzle,
  placement: Placement,
  targetRow: number,
  targetCol: number
): boolean {
  const cellMap = buildCellLookup(puzzle);
  
  // Get cells that would be covered by the placement at the new position
  const offsetRow = targetRow - placement.row;
  const offsetCol = targetCol - placement.col;
  
  const originalCells = getPlacementCells(placement);
  const newCells = originalCells.map(cell => ({
    row: cell.row + offsetRow,
    col: cell.col + offsetCol,
  }));
  
  // Check if all new cells exist and are not occupied
  for (const cell of newCells) {
    // Check if cell exists
    if (!cellMap.has(`${cell.row}-${cell.col}`)) {
      return false;
    }
    
    // Check if cell is already occupied by another placement
    const existingPlacement = puzzle.placements.find(p => {
      const cells = getPlacementCells(p);
      return cells.some(c => c.row === cell.row && c.col === cell.col);
    });
    
    // Allow if it's the same placement (moving to same position or overlapping)
    if (existingPlacement && existingPlacement.id !== placement.id) {
      return false;
    }
  }
  
  return true;
}

/**
 * Get all valid drop locations for a placement
 */
export function getValidDropLocations(
  puzzle: Puzzle,
  placement: Placement
): CellPosition[] {
  const validLocations: CellPosition[] = [];
  
  // Check each cell in the puzzle
  for (const cell of puzzle.cells) {
    if (isValidDropLocation(puzzle, placement, cell.row, cell.col)) {
      validLocations.push({ row: cell.row, col: cell.col });
    }
  }
  
  return validLocations;
}

/**
 * Snap coordinates to the nearest valid cell
 */
export function snapToGrid(
  clientX: number,
  clientY: number,
  boardRect: DOMRect,
  cellSize: number,
  bounds: { minRow: number; minCol: number },
  cellMap: Map<string, unknown>
): { row: number; col: number } | null {
  const relativeX = clientX - boardRect.left;
  const relativeY = clientY - boardRect.top;
  
  const relativeCol = Math.round(relativeX / cellSize);
  const relativeRow = Math.round(relativeY / cellSize);
  
  const col = relativeCol + bounds.minCol;
  const row = relativeRow + bounds.minRow;
  
  const key = `${row}-${col}`;
  if (cellMap.has(key)) {
    return { row, col };
  }
  
  return null;
}

