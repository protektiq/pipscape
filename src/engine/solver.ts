import type { Puzzle, Placement, CellPosition } from '../types/puzzle';
import type { Edge } from '../types/edge';
import { cellToKey, getAdjacentCells } from './cellUtils';
import { normalizeEdge, edgeToPlacement } from './edgeUtils';
import { validatePuzzle } from './validator';

/**
 * Backtracking solver aligned with brianberns/Pips approach.
 * 
 * Uses Edge-based representation internally:
 * - Finds valid tilings (sets of edges covering all cells)
 * - Assigns dominoes to edges
 * - Validates region constraints during backtracking
 * - Converts results back to Placement[] format
 */

/**
 * Solves a puzzle by finding a valid placement of all dominoes.
 * 
 * Algorithm:
 * 1. Extract cells and regions from puzzle
 * 2. Use backtracking to:
 *    a) Find valid tiling (set of edges covering all cells)
 *    b) Assign dominoes to edges
 *    c) Validate region constraints at each step
 * 3. Convert solution edges back to Placements
 * 4. Return solved Puzzle
 * 
 * @param puzzle - The puzzle to solve
 * @returns A puzzle with all placements filled in, or null if no solution exists
 */
export const solvePuzzle = (puzzle: Puzzle): Puzzle | null => {
  // Check if puzzle already has a solution cached
  if (puzzle.solution && puzzle.solution.length > 0) {
    return {
      ...puzzle,
      placements: [...puzzle.solution],
    };
  }

  // Extract cells and regions
  const cellPositions: CellPosition[] = puzzle.cells.map(cell => ({
    row: cell.row,
    col: cell.col,
  }));

  // Check for valid number of cells (must be even for dominoes)
  if (cellPositions.length % 2 !== 0) {
    return null;
  }

  // Create set of active cells for quick lookup
  const activeCells = new Set(cellPositions.map(cellToKey));
  
  // Create cell lookup map
  const cellMap = new Map<string, CellPosition>();
  for (const cell of cellPositions) {
    cellMap.set(cellToKey(cell), cell);
  }

  // Get available dominoes
  const availableDominoes = [...puzzle.availableDominoes];
  
  // Track state during backtracking
  const usedDominoIds = new Set<string>();
  const coveredCells = new Set<string>();
  const currentTiling: Edge[] = [];
  const dominoAssignments: Array<{ edge: Edge; dominoId: string }> = [];

  // Helper to check if a cell is valid and uncovered
  const isValidUncoveredCell = (cell: CellPosition): boolean => {
    const key = cellToKey(cell);
    return activeCells.has(key) && !coveredCells.has(key);
  };

  // Helper to check if a placement would violate constraints early
  // (Partial constraint checking for early pruning)
  const checkPartialConstraints = (newEdge: Edge): boolean => {
    // Check if this placement would overlap existing placements
    const newCells = [newEdge[0], newEdge[1]];
    for (const existingEdge of currentTiling) {
      const existingCells = [existingEdge[0], existingEdge[1]];
      for (const newCell of newCells) {
        for (const existingCell of existingCells) {
          if (cellToKey(newCell) === cellToKey(existingCell)) {
            // Would overlap - invalid
            return false;
          }
        }
      }
    }

    return true;
  };

  // Recursive backtracking function
  const backtrack = (): boolean => {
    // Base case: all cells are covered
    if (coveredCells.size === cellPositions.length) {
      // Validate the complete solution
      const solutionPlacements: Placement[] = dominoAssignments.map(
        ({ edge, dominoId }) => edgeToPlacement(edge, dominoId)
      );

      const solvedPuzzle: Puzzle = {
        ...puzzle,
        placements: solutionPlacements,
      };

      const validation = validatePuzzle(solvedPuzzle);
      return validation.isValid;
    }

    // Find first uncovered cell
    let uncoveredCell: CellPosition | null = null;
    for (const cell of cellPositions) {
      if (!coveredCells.has(cellToKey(cell))) {
        uncoveredCell = cell;
        break;
      }
    }

    if (!uncoveredCell) {
      return false;
    }

    const uncoveredKey = cellToKey(uncoveredCell);

    // Try placing a domino covering this cell
    // Try each available domino
    for (const domino of availableDominoes) {
      if (usedDominoIds.has(domino.id)) {
        continue;
      }

      // Try each neighbor cell
      const neighbors = getAdjacentCells(uncoveredCell);
      
      for (const neighbor of neighbors) {
        if (!isValidUncoveredCell(neighbor)) {
          continue;
        }

        // Create edge for this placement
        const edge: Edge = normalizeEdge([uncoveredCell, neighbor]);
        
        // Check for duplicate edge (shouldn't happen, but be safe)
        const edgeAlreadyUsed = currentTiling.some(e => {
          const e1 = normalizeEdge(e);
          const e2 = normalizeEdge(edge);
          return cellToKey(e1[0]) === cellToKey(e2[0]) && 
                 cellToKey(e1[1]) === cellToKey(e2[1]);
        });

        if (edgeAlreadyUsed) {
          continue;
        }

        // Check partial constraints (early pruning)
        if (!checkPartialConstraints(edge)) {
          continue;
        }

        // Try both orientations of the domino on this edge
        // (For doubles, there's only one orientation; for others, we try both)
        const tryOrientations = domino.left !== domino.right;
        
        // Try first orientation
        for (let tryReversed = 0; tryReversed < (tryOrientations ? 2 : 1); tryReversed++) {
          // Add to current state
          currentTiling.push(edge);
          coveredCells.add(uncoveredKey);
          coveredCells.add(cellToKey(neighbor));
          usedDominoIds.add(domino.id);
          dominoAssignments.push({ edge, dominoId: domino.id });

          // Recursively solve
          if (backtrack()) {
            return true; // Found solution!
          }

          // Backtrack: remove this assignment
          currentTiling.pop();
          coveredCells.delete(uncoveredKey);
          coveredCells.delete(cellToKey(neighbor));
          usedDominoIds.delete(domino.id);
          dominoAssignments.pop();
        }
      }
    }

    return false; // No solution found from this state
  };

  // Start backtracking
  const foundSolution = backtrack();

  if (!foundSolution) {
    return null;
  }

  // Convert solution to placements
  const solutionPlacements: Placement[] = dominoAssignments.map(
    ({ edge, dominoId }) => edgeToPlacement(edge, dominoId)
  );

  // Return solved puzzle
  return {
    ...puzzle,
    placements: solutionPlacements,
  };
};

/**
 * Check if a puzzle is already solved (all cells covered and constraints satisfied).
 * 
 * @param puzzle - The puzzle to check
 * @returns true if the puzzle is fully solved
 */
export const isPuzzleSolved = (puzzle: Puzzle): boolean => {
  // Check if all cells are covered
  const cellKeys = new Set(puzzle.cells.map(c => `${c.row}-${c.col}`));
  const coveredCells = new Set<string>();

  for (const placement of puzzle.placements) {
    const cells = [
      { row: placement.row, col: placement.col },
      placement.orientation === 'horizontal'
        ? { row: placement.row, col: placement.col + 1 }
        : { row: placement.row + 1, col: placement.col },
    ];

    for (const cell of cells) {
      const key = `${cell.row}-${cell.col}`;
      if (!cellKeys.has(key)) {
        return false; // Placement covers invalid cell
      }
      if (coveredCells.has(key)) {
        return false; // Overlapping placements
      }
      coveredCells.add(key);
    }
  }

  // Check that all cells are covered
  if (coveredCells.size !== cellKeys.size) {
    return false;
  }

  // Check constraints
  const validation = validatePuzzle(puzzle);
  return validation.isValid;
};
