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

  // Create a set of region cell keys for quick lookup
  const regionCellKeys = new Set<string>();
  for (const cell of region.cells) {
    regionCellKeys.add(`${cell.row}-${cell.col}`);
  }

  let sum = 0;
  const processedPlacements = new Set<string>();

  // Check each placement to see if it overlaps with the region
  for (const placement of puzzle.placements) {
    // Skip if we've already processed this placement
    if (processedPlacements.has(placement.dominoId)) {
      continue;
    }

    const placementCells = getPlacementCells(placement);
    
    // Check if ANY cell of this placement is in the region
    const hasOverlap = placementCells.some(
      pc => regionCellKeys.has(`${pc.row}-${pc.col}`)
    );

    if (hasOverlap) {
      // Add the domino value (only count once per domino)
      sum += getDominoValueForPlacement(puzzle, placement.dominoId);
      processedPlacements.add(placement.dominoId);
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

  // Create a set of region cell keys for quick lookup
  const regionCellKeys = new Set<string>();
  for (const cell of region.cells) {
    regionCellKeys.add(`${cell.row}-${cell.col}`);
  }

  const dominoValues: number[] = [];
  const processedPlacements = new Set<string>();

  // Check each placement to see if it overlaps with the region
  for (const placement of puzzle.placements) {
    // Skip if we've already processed this placement
    if (processedPlacements.has(placement.dominoId)) {
      continue;
    }

    const placementCells = getPlacementCells(placement);
    
    // Check if ANY cell of this placement is in the region
    const hasOverlap = placementCells.some(
      pc => regionCellKeys.has(`${pc.row}-${pc.col}`)
    );

    if (hasOverlap) {
      // Add the domino value (only count once per domino)
      const value = getDominoValueForPlacement(puzzle, placement.dominoId);
      dominoValues.push(value);
      processedPlacements.add(placement.dominoId);
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
      case RuleType.SUM_EQUALS: {
        const sum = calculateRegionSum(puzzle, region.id);
        const dominoValues = getAllDominoValuesInRegion(puzzle, region.id);
        // Must have at least one placement in the region, and sum must equal rule.value
        isValid = dominoValues.length > 0 && sum === rule.value;
        break;
      }
      case RuleType.SUM_LESS_THAN: {
        const sum = calculateRegionSum(puzzle, region.id);
        const dominoValues = getAllDominoValuesInRegion(puzzle, region.id);
        // Must have at least one placement in the region, and sum must be less than rule.value
        isValid = dominoValues.length > 0 && sum < rule.value;
        break;
      }
      case RuleType.SUM_GREATER_THAN: {
        const sum = calculateRegionSum(puzzle, region.id);
        const dominoValues = getAllDominoValuesInRegion(puzzle, region.id);
        // Must have at least one placement in the region, and sum must be greater than rule.value
        isValid = dominoValues.length > 0 && sum > rule.value;
        break;
      }
      case RuleType.VALUES_EQUAL: {
        const dominoValues = getAllDominoValuesInRegion(puzzle, region.id);
        // A region with 0 dominoes is invalid (needs at least one)
        // A region with 1 domino is trivially valid
        // A region with 2+ dominoes must have all values equal
        if (dominoValues.length === 0) {
          isValid = false;
        } else if (dominoValues.length === 1) {
          isValid = true;
        } else {
          const firstValue = dominoValues[0];
          isValid = dominoValues.every(value => value === firstValue);
        }
        break;
      }
      case RuleType.VALUES_NOT_EQUAL: {
        const dominoValues = getAllDominoValuesInRegion(puzzle, region.id);
        // A region with 0 or 1 domino is invalid (needs at least 2 to compare)
        // A region with 2+ dominoes must have at least one different value (not all equal)
        if (dominoValues.length < 2) {
          isValid = false;
        } else {
          const firstValue = dominoValues[0];
          isValid = !dominoValues.every(value => value === firstValue);
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



