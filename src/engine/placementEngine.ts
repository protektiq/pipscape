import type { Puzzle, CellPosition, Placement } from '../types/puzzle';
import { validatePlacement } from './validator';
import { 
  areCellsAdjacent, 
  createPlacementFromCells, 
  getPlacementForCell,
  canRotatePlacement,
  getPlacementAtDragTarget,
  isValidCell,
} from './placementUtils';

// Process first cell click in placement mode
export const handleFirstCellClick = (cell: CellPosition): { firstCell: CellPosition; mode: 'place-second' } => {
  return {
    firstCell: cell,
    mode: 'place-second',
  };
};

// Process second cell click in placement mode
export const handleSecondCellClick = (
  firstCell: CellPosition,
  secondCell: CellPosition,
  selectedDominoId: string,
  puzzle: Puzzle
): { 
  success: boolean; 
  placement?: Placement; 
  error?: string;
} => {
  // Check if cells are adjacent
  if (!areCellsAdjacent(firstCell, secondCell)) {
    // Not adjacent, treat as new first cell
    return {
      success: false,
      error: 'Cells must be adjacent',
    };
  }

  // Create placement
  const placement = createPlacementFromCells(firstCell, secondCell, selectedDominoId);

  // Validate placement
  const validation = validatePlacement(puzzle, placement);
  
  if (validation.isValid) {
    return {
      success: true,
      placement,
    };
  } else {
    return {
      success: false,
      error: validation.error || 'Invalid placement',
    };
  }
};

// Add placement to puzzle
export const addPlacementToPuzzle = (puzzle: Puzzle, placement: Placement): Puzzle => {
  return {
    ...puzzle,
    placements: [...puzzle.placements, placement],
  };
};

// Remove placement from puzzle
export const removePlacementFromPuzzle = (row: number, col: number, puzzle: Puzzle): Puzzle => {
  const placement = getPlacementForCell(row, col, puzzle.placements);
  
  if (!placement) {
    return puzzle;
  }

  return {
    ...puzzle,
    placements: puzzle.placements.filter(p => p.dominoId !== placement.dominoId),
  };
};

// Check if domino is placed
export const isDominoPlaced = (dominoId: string, puzzle: Puzzle): boolean => {
  return puzzle.placements.some(p => p.dominoId === dominoId);
};

// Rotate a placement in the puzzle (toggle horizontal/vertical)
export const rotatePlacementInPuzzle = (puzzle: Puzzle, placement: Placement): Puzzle => {
  // Check if rotation is possible (within bounds and cells exist)
  if (!canRotatePlacement(placement, puzzle)) {
    return puzzle; // Cannot rotate, return unchanged
  }

  // Create rotated placement
  const newOrientation = placement.orientation === 'horizontal' ? 'vertical' : 'horizontal';
  const rotatedPlacement: Placement = {
    ...placement,
    id: `${placement.dominoId}-${placement.row}-${placement.col}`,
    orientation: newOrientation,
  };

  // Validate the rotated placement (check for overlaps, etc.)
  // We need to temporarily remove the original placement to validate
  const placementsWithoutOriginal = puzzle.placements.filter(
    p => p.dominoId !== placement.dominoId
  );
  const tempPuzzle: Puzzle = {
    ...puzzle,
    placements: placementsWithoutOriginal,
  };

  const validation = validatePlacement(tempPuzzle, rotatedPlacement);
  if (!validation.isValid) {
    return puzzle; // Invalid rotation, return unchanged
  }

  // Update the placement
  return {
    ...puzzle,
    placements: puzzle.placements.map(p =>
      p.dominoId === placement.dominoId ? rotatedPlacement : p
    ),
  };
};

// Create a placement with a specific orientation at a given cell position
export const createPlacementWithOrientation = (
  dominoId: string,
  cell: CellPosition,
  orientation: 'horizontal' | 'vertical',
  puzzle: Puzzle
): { 
  success: boolean; 
  placement?: Placement; 
  error?: string;
} => {
  // Check if cell exists and is valid
  if (!isValidCell(cell, puzzle)) {
    return {
      success: false,
      error: 'Cell does not exist or is out of bounds',
    };
  }

  // Calculate second cell position based on orientation
  const secondCell: CellPosition = orientation === 'horizontal'
    ? { row: cell.row, col: cell.col + 1 }
    : { row: cell.row + 1, col: cell.col };

  // Check if second cell exists and is valid
  if (!isValidCell(secondCell, puzzle)) {
    return {
      success: false,
      error: 'Placement would be out of bounds or cell does not exist',
    };
  }

  // Create placement
  const placement: Placement = {
    id: `${dominoId}-${cell.row}-${cell.col}`,
    dominoId,
    row: cell.row,
    col: cell.col,
    orientation,
    fixed: false,
  };

  // Validate placement
  const validation = validatePlacement(puzzle, placement);
  
  if (validation.isValid) {
    return {
      success: true,
      placement,
    };
  } else {
    return {
      success: false,
      error: validation.error || 'Invalid placement',
    };
  }
};

// Move a placement to a new position
export const movePlacementInPuzzle = (
  puzzle: Puzzle,
  fromPlacement: Placement,
  toCell: CellPosition
): { success: boolean; puzzle?: Puzzle; error?: string } => {
  // Calculate new placement position
  const newPlacement = getPlacementAtDragTarget(fromPlacement, toCell, puzzle);
  
  if (!newPlacement) {
    return {
      success: false,
      error: 'Cannot place domino at target position (out of bounds)',
    };
  }

  // Temporarily remove the original placement to validate
  const placementsWithoutOriginal = puzzle.placements.filter(
    p => p.dominoId !== fromPlacement.dominoId
  );
  const tempPuzzle: Puzzle = {
    ...puzzle,
    placements: placementsWithoutOriginal,
  };

  // Validate the new placement
  const validation = validatePlacement(tempPuzzle, newPlacement);
  if (!validation.isValid) {
    return {
      success: false,
      error: validation.error || 'Invalid placement',
    };
  }

  // Update the puzzle with the new placement
  const updatedPuzzle: Puzzle = {
    ...puzzle,
    placements: [...placementsWithoutOriginal, newPlacement],
  };

  return {
    success: true,
    puzzle: updatedPuzzle,
  };
};

