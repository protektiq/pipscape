import type { Puzzle, Cell, Placement } from '../types/puzzle';
import { validatePlacement } from './validator';
import { 
  areCellsAdjacent, 
  createPlacementFromCells, 
  getPlacementForCell,
  canRotatePlacement,
  getPlacementAtDragTarget,
} from './placementUtils';

// Process first cell click in placement mode
export const handleFirstCellClick = (cell: Cell): { firstCell: Cell; mode: 'place-second' } => {
  return {
    firstCell: cell,
    mode: 'place-second',
  };
};

// Process second cell click in placement mode
export const handleSecondCellClick = (
  firstCell: Cell,
  secondCell: Cell,
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
  // Check if rotation is possible (within bounds)
  if (!canRotatePlacement(placement, puzzle.gridSize)) {
    return puzzle; // Cannot rotate, return unchanged
  }

  // Create rotated placement
  const newOrientation = placement.orientation === 'horizontal' ? 'vertical' : 'horizontal';
  const rotatedPlacement: Placement = {
    ...placement,
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

// Move a placement to a new position
export const movePlacementInPuzzle = (
  puzzle: Puzzle,
  fromPlacement: Placement,
  toCell: Cell
): { success: boolean; puzzle?: Puzzle; error?: string } => {
  // Calculate new placement position
  const newPlacement = getPlacementAtDragTarget(fromPlacement, toCell, puzzle.gridSize);
  
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

