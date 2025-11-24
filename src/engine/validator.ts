import type { Puzzle, Placement, ValidationResult } from '../types/puzzle';
import { RuleType } from '../types/puzzle';
import { getPlacementCells, isValidCell, placementsOverlap } from './placementUtils';
import { getDominoValue } from './dominoUtils';

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

  // Check bounds and cell existence (for sparse grids)
  for (const cell of cells) {
    if (!isValidCell(cell, puzzle)) {
      return {
        isValid: false,
        error: 'Placement is out of bounds or cell does not exist',
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
const getDominoValueForPlacement = (puzzle: Puzzle, dominoId: string): number => {
  const domino = puzzle.availableDominoes.find(d => d.id === dominoId);
  if (!domino) {
    return 0;
  }
  return getDominoValue(domino);
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
          sum += getDominoValueForPlacement(puzzle, placement.dominoId);
        }
        break; // Found the placement covering this cell
      }
    }
  }

  return sum;
};

// Get all domino values in a region (each domino counted only once)
const getAllDominoValuesInRegion = (puzzle: Puzzle, regionId: string): number[] => {
  const region = puzzle.regions.find(r => r.id === regionId);
  if (!region) {
    return [];
  }

  const dominoValues: number[] = [];
  const processedPlacements = new Set<string>();

  // Check each cell in the region
  for (const cell of region.cells) {
    // Find if there's a placement covering this cell
    for (const placement of puzzle.placements) {
      // Skip if we've already processed this placement
      if (processedPlacements.has(placement.dominoId)) {
        continue;
      }

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
          const value = getDominoValueForPlacement(puzzle, placement.dominoId);
          dominoValues.push(value);
          processedPlacements.add(placement.dominoId);
        }
        break; // Found the placement covering this cell
      }
    }
  }

  return dominoValues;
};

// Validate the entire puzzle
export const validatePuzzle = (puzzle: Puzzle): ValidationResult => {
  const invalidRegions: string[] = [];

  for (const region of puzzle.regions) {
    const rule = region.rule;

    let isValid = true;

    switch (rule.type) {
      case RuleType.SUM_AT_LEAST: {
        const sum = calculateRegionSum(puzzle, region.id);
        isValid = sum >= rule.value;
        break;
      }
      case RuleType.SUM_AT_MOST: {
        const sum = calculateRegionSum(puzzle, region.id);
        isValid = sum <= rule.value;
        break;
      }
      case RuleType.VALUES_EQUAL: {
        const dominoValues = getAllDominoValuesInRegion(puzzle, region.id);
        // A region with 0 or 1 domino is trivially valid
        // A region with 2+ dominoes must have all values equal
        if (dominoValues.length > 1) {
          const firstValue = dominoValues[0];
          isValid = dominoValues.every(value => value === firstValue);
        }
        break;
      }
      case RuleType.VALUES_ALL_DIFFERENT: {
        const dominoValues = getAllDominoValuesInRegion(puzzle, region.id);
        // A region with 0 or 1 domino is trivially valid
        // A region with 2+ dominoes must have all unique values
        if (dominoValues.length > 1) {
          const uniqueValues = new Set(dominoValues);
          isValid = uniqueValues.size === dominoValues.length;
        }
        break;
      }
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



