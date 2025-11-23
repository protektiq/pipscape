import type { Placement, Cell } from '../types/puzzle';

// Get the two cells occupied by a placement
export const getPlacementCells = (placement: Placement): Cell[] => {
  const cells: Cell[] = [
    { row: placement.row, col: placement.col },
  ];

  if (placement.orientation === 'horizontal') {
    cells.push({ row: placement.row, col: placement.col + 1 });
  } else {
    cells.push({ row: placement.row + 1, col: placement.col });
  }

  return cells;
};

// Check if a cell is within grid bounds
export const isWithinBounds = (cell: Cell, gridSize: number): boolean => {
  return cell.row >= 0 && 
         cell.row < gridSize && 
         cell.col >= 0 && 
         cell.col < gridSize;
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

// Get placement covering a specific cell
export const getPlacementForCell = (row: number, col: number, placements: Placement[]): Placement | undefined => {
  return placements.find(p => {
    const cells = getPlacementCells(p);
    return cells.some(c => c.row === row && c.col === col);
  });
};

// Check if two cells are adjacent (horizontally or vertically)
export const areCellsAdjacent = (cell1: Cell, cell2: Cell): boolean => {
  const rowDiff = Math.abs(cell1.row - cell2.row);
  const colDiff = Math.abs(cell1.col - cell2.col);
  return (rowDiff === 1 && colDiff === 0) || (rowDiff === 0 && colDiff === 1);
};

// Determine placement orientation from two cells
export const getPlacementOrientation = (cell1: Cell, cell2: Cell): 'horizontal' | 'vertical' => {
  const colDiff = cell2.col - cell1.col;
  return colDiff !== 0 ? 'horizontal' : 'vertical';
};

// Create a placement from two cells, ensuring first cell is leftmost/topmost
export const createPlacementFromCells = (
  cell1: Cell,
  cell2: Cell,
  dominoId: string
): Placement => {
  const orientation = getPlacementOrientation(cell1, cell2);
  
  // Ensure first cell is the leftmost/topmost
  const startRow = orientation === 'horizontal' ? cell1.row : Math.min(cell1.row, cell2.row);
  const startCol = orientation === 'horizontal' ? Math.min(cell1.col, cell2.col) : cell1.col;

  return {
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

// Check if a placement can be rotated without going out of bounds
export const canRotatePlacement = (placement: Placement, gridSize: number): boolean => {
  const newOrientation = placement.orientation === 'horizontal' ? 'vertical' : 'horizontal';
  const rotatedPlacement: Placement = {
    ...placement,
    orientation: newOrientation,
  };
  
  const cells = getPlacementCells(rotatedPlacement);
  return cells.every(cell => isWithinBounds(cell, gridSize));
};

// Calculate new placement position based on drag target
// Returns the new placement if valid, null otherwise
export const getPlacementAtDragTarget = (
  placement: Placement,
  targetCell: Cell,
  gridSize: number
): Placement | null => {
  // Try both orientations to see which one fits
  const orientations: ('horizontal' | 'vertical')[] = ['horizontal', 'vertical'];
  
  for (const orientation of orientations) {
    // Try placing with targetCell as the first cell
    const candidate1: Placement = {
      ...placement,
      row: targetCell.row,
      col: targetCell.col,
      orientation,
    };
    
    const cells1 = getPlacementCells(candidate1);
    if (cells1.every(cell => isWithinBounds(cell, gridSize))) {
      return candidate1;
    }
    
    // Try placing with targetCell as the second cell
    let candidate2: Placement;
    if (orientation === 'horizontal') {
      candidate2 = {
        ...placement,
        row: targetCell.row,
        col: targetCell.col - 1,
        orientation,
      };
    } else {
      candidate2 = {
        ...placement,
        row: targetCell.row - 1,
        col: targetCell.col,
        orientation,
      };
    }
    
    const cells2 = getPlacementCells(candidate2);
    if (cells2.every(cell => isWithinBounds(cell, gridSize))) {
      return candidate2;
    }
  }
  
  return null;
};

