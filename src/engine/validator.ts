import type { Puzzle, Placement, Cell, ValidationResult } from '../types/puzzle';
import { RuleType, GRID_SIZE } from '../types/puzzle';

// Get the two cells occupied by a placement
const getPlacementCells = (placement: Placement): Cell[] => {
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
const isWithinBounds = (cell: Cell): boolean => {
  return cell.row >= 0 && 
         cell.row < GRID_SIZE && 
         cell.col >= 0 && 
         cell.col < GRID_SIZE;
};

// Check if two placements overlap
const placementsOverlap = (p1: Placement, p2: Placement): boolean => {
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

// Validate a single placement
export const validatePlacement = (
  puzzle: Puzzle,
  placement: Placement
): { isValid: boolean; error?: string } => {
  // Check if domino exists in available dominoes
  const domino = puzzle.availableDominoes.find(d => d.id === placement.dominoId);
  if (!domino) {
    return {
      isValid: false,
      error: 'Domino not found in available dominoes',
    };
  }

  const cells = getPlacementCells(placement);

  // Check bounds
  for (const cell of cells) {
    if (!isWithinBounds(cell)) {
      return {
        isValid: false,
        error: 'Placement is out of bounds',
      };
    }
  }

  // Check if domino is already placed
  const existingPlacement = puzzle.placements.find(
    p => p.dominoId === placement.dominoId
  );

  if (existingPlacement) {
    return {
      isValid: false,
      error: 'Domino is already placed',
    };
  }

  // Check for overlaps with existing placements
  for (const existingPlacement of puzzle.placements) {
    if (placementsOverlap(placement, existingPlacement)) {
      return {
        isValid: false,
        error: 'Placement overlaps with existing domino',
      };
    }
  }

  return { isValid: true };
};

// Get the domino value (sum of pips) for a placement
const getDominoValue = (puzzle: Puzzle, dominoId: string): number => {
  const domino = puzzle.availableDominoes.find(d => d.id === dominoId);
  if (!domino) {
    return 0;
  }
  return domino.left + domino.right;
};

// Calculate the sum of pips in a region
const calculateRegionSum = (puzzle: Puzzle, regionId: string): number => {
  const region = puzzle.regions.find(r => r.id === regionId);
  if (!region) {
    return 0;
  }

  let sum = 0;

  // Check each cell in the region
  for (const cell of region.cells) {
    // Find if there's a placement covering this cell
    for (const placement of puzzle.placements) {
      const placementCells = getPlacementCells(placement);
      
      // Check if this cell is covered by the placement
      const isCovered = placementCells.some(
        pc => pc.row === cell.row && pc.col === cell.col
      );

      if (isCovered) {
        // Add the domino value (only count once per domino)
        // We'll count it when we hit the first cell of the domino
        const firstCell = placementCells[0];
        if (cell.row === firstCell.row && cell.col === firstCell.col) {
          sum += getDominoValue(puzzle, placement.dominoId);
        }
        break; // Found the placement covering this cell
      }
    }
  }

  return sum;
};

// Validate the entire puzzle
export const validatePuzzle = (puzzle: Puzzle): ValidationResult => {
  const invalidRegions: string[] = [];

  for (const region of puzzle.regions) {
    const sum = calculateRegionSum(puzzle, region.id);
    const rule = region.rule;

    let isValid = true;

    switch (rule.type) {
      case RuleType.SUM_AT_LEAST:
        isValid = sum >= rule.value;
        break;
      case RuleType.SUM_AT_MOST:
        isValid = sum <= rule.value;
        break;
      default:
        isValid = false;
    }

    if (!isValid) {
      invalidRegions.push(region.id);
    }
  }

  const isValid = invalidRegions.length === 0;
  const message = isValid
    ? 'All regions satisfied!'
    : `${invalidRegions.length} region(s) do not satisfy their constraints.`;

  return {
    isValid,
    invalidRegions,
    message,
  };
};



