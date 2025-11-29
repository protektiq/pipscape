import type { Placement, CellPosition, Puzzle } from '../types/puzzle';
import { buildCellLookup } from '../types/puzzle';

// Get the two cell positions occupied by a placement
export const getPlacementCells = (placement: Placement): CellPosition[] => {
  const cells: CellPosition[] = [
    { row: placement.row, col: placement.col },
  ];

  if (placement.orientation === 'horizontal') {
    cells.push({ row: placement.row, col: placement.col + 1 });
  } else {
    cells.push({ row: placement.row + 1, col: placement.col });
  }

  return cells;
};

// Build a lookup Map for O(1) placement access by cell coordinates
// Key format: `${row}-${col}`, Value: Placement
export const buildPlacementLookup = (placements: Placement[]): Map<string, Placement> => {
  const lookup = new Map<string, Placement>();
  
  for (const placement of placements) {
    const cells = getPlacementCells(placement);
    for (const cell of cells) {
      const key = `${cell.row}-${cell.col}`;
      // If a cell is covered by multiple placements (shouldn't happen in valid puzzles),
      // the last one wins. This is fine for our use case.
      lookup.set(key, placement);
    }
  }
  
  return lookup;
};

// Check if a cell position is within grid bounds
export const isWithinBounds = (cell: CellPosition, rows: number, cols: number): boolean => {
  return cell.row >= 0 && 
         cell.row < rows && 
         cell.col >= 0 && 
         cell.col < cols;
};

// Check if a cell position exists in the puzzle (for sparse grids)
export const cellExists = (cell: CellPosition, puzzle: Puzzle): boolean => {
  const cellMap = buildCellLookup(puzzle);
  return cellMap.has(`${cell.row}-${cell.col}`);
};

// Check if a cell position is valid (within bounds AND exists in sparse grid)
export const isValidCell = (cell: CellPosition, puzzle: Puzzle): boolean => {
  return isWithinBounds(cell, puzzle.rows, puzzle.cols) && cellExists(cell, puzzle);
};

// Check if two placements overlap
export const placementsOverlap = (p1: Placement, p2: Placement): boolean => {
  const cells1 = getPlacementCells(p1);
  const cells2 = getPlacementCells(p2);

  for (const c1 of cells1) {
    for (const c2 of cells2) {
      if (c1.row === c2.row && c1.col === c2.col) {
        return true;
      }
    }
  }

  return false;
};

// Get placement covering a specific cell (O(n) - use buildPlacementLookup for O(1) access)
export const getPlacementForCell = (row: number, col: number, placements: Placement[]): Placement | undefined => {
  return placements.find(p => {
    const cells = getPlacementCells(p);
    return cells.some(c => c.row === row && c.col === col);
  });
};

// Get placement covering a specific cell using a lookup Map (O(1) access)
export const getPlacementForCellFromMap = (
  row: number,
  col: number,
  placementLookup: Map<string, Placement>
): Placement | undefined => {
  return placementLookup.get(`${row}-${col}`);
};

// Check if two cell positions are adjacent (horizontally or vertically)
export const areCellsAdjacent = (cell1: CellPosition, cell2: CellPosition): boolean => {
  const rowDiff = Math.abs(cell1.row - cell2.row);
  const colDiff = Math.abs(cell1.col - cell2.col);
  return (rowDiff === 1 && colDiff === 0) || (rowDiff === 0 && colDiff === 1);
};

// Determine placement orientation from two cell positions
export const getPlacementOrientation = (cell1: CellPosition, cell2: CellPosition): 'horizontal' | 'vertical' => {
  const colDiff = cell2.col - cell1.col;
  return colDiff !== 0 ? 'horizontal' : 'vertical';
};

// Create a placement from two cell positions, ensuring first cell is leftmost/topmost
export const createPlacementFromCells = (
  cell1: CellPosition,
  cell2: CellPosition,
  dominoId: string
): Placement => {
  const orientation = getPlacementOrientation(cell1, cell2);
  
  // Ensure first cell is the leftmost/topmost
  const startRow = orientation === 'horizontal' ? cell1.row : Math.min(cell1.row, cell2.row);
  const startCol = orientation === 'horizontal' ? Math.min(cell1.col, cell2.col) : cell1.col;

  return {
    id: `${dominoId}-${startRow}-${startCol}`,
    dominoId,
    row: startRow,
    col: startCol,
    orientation,
    fixed: false,
  };
};

// Check if a cell has a placement
export const cellHasPlacement = (row: number, col: number, placements: Placement[]): boolean => {
  return getPlacementForCell(row, col, placements) !== undefined;
};

// Check if a placement can be rotated without going out of bounds and cells exist
export const canRotatePlacement = (placement: Placement, puzzle: Puzzle): boolean => {
  const newOrientation = placement.orientation === 'horizontal' ? 'vertical' : 'horizontal';
  const rotatedPlacement: Placement = {
    ...placement,
    orientation: newOrientation,
  };
  
  const cells = getPlacementCells(rotatedPlacement);
  return cells.every(cell => isValidCell(cell, puzzle));
};

// Calculate new placement position based on drag target
// Returns the new placement if valid, null otherwise
export const getPlacementAtDragTarget = (
  placement: Placement,
  targetCell: CellPosition,
  puzzle: Puzzle
): Placement | null => {
  // Try both orientations to see which one fits
  const orientations: ('horizontal' | 'vertical')[] = ['horizontal', 'vertical'];
  
  for (const orientation of orientations) {
    // Try placing with targetCell as the first cell
    const candidate1: Placement = {
      ...placement,
      id: `${placement.dominoId}-${targetCell.row}-${targetCell.col}`,
      row: targetCell.row,
      col: targetCell.col,
      orientation,
    };
    
    const cells1 = getPlacementCells(candidate1);
    if (cells1.every(cell => isValidCell(cell, puzzle))) {
      return candidate1;
    }
    
    // Try placing with targetCell as the second cell
    let candidate2: Placement;
    if (orientation === 'horizontal') {
      candidate2 = {
        ...placement,
        id: `${placement.dominoId}-${targetCell.row}-${targetCell.col - 1}`,
        row: targetCell.row,
        col: targetCell.col - 1,
        orientation,
      };
    } else {
      candidate2 = {
        ...placement,
        id: `${placement.dominoId}-${targetCell.row - 1}-${targetCell.col}`,
        row: targetCell.row - 1,
        col: targetCell.col,
        orientation,
      };
    }
    
    const cells2 = getPlacementCells(candidate2);
    if (cells2.every(cell => isValidCell(cell, puzzle))) {
      return candidate2;
    }
  }
  
  return null;
};

