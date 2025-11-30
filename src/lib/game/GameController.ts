// GameController - Unified action controller for Pipscape
// All game actions (solve, undo, reset, move, rotate) are handled here

import type { Puzzle, CellPosition, ValidationResult } from '../../types/puzzle';
import { validatePuzzle as validatePuzzleEngine } from '../../engine/validator';
import {
  addPlacementToPuzzle,
  removePlacementFromPuzzle,
  rotatePlacementInPuzzle,
  movePlacementInPuzzle,
  createPlacementWithOrientation,
} from '../../engine/placementEngine';
import { getPlacementForCell } from '../../engine/placementUtils';
import { solutionCache } from '../../engine/solutionCache';
import { solvePuzzle as solvePuzzleEngine } from '../../engine/solver';

export class GameController {
  /**
   * Solve the puzzle by setting placements to the solution.
   * Uses cached solution if available, otherwise uses backtracking solver.
   */
  solve(puzzle: Puzzle): Puzzle {
    // Try to get solution from puzzle first, then from cache
    let solution = puzzle.solution;
    
    if (!solution) {
      const cachedSolution = solutionCache.get(puzzle.seed);
      if (cachedSolution) {
        solution = cachedSolution;
      }
    }

    // If no cached solution, try using the backtracking solver
    if (!solution) {
      console.log('No cached solution found, attempting to solve using backtracking solver...');
      const solvedPuzzle = solvePuzzleEngine(puzzle);
      
      if (solvedPuzzle && solvedPuzzle.placements.length > 0) {
        // Cache the solution for future use
        solution = solvedPuzzle.placements;
        solutionCache.set(puzzle.seed, solution);
        
        return {
          ...puzzle,
          placements: [...solution],
          solution, // Ensure solution is stored
        };
      } else {
        console.warn('Solver could not find a solution for puzzle:', puzzle.id);
        return puzzle; // Return unchanged if no solution found
      }
    }

    return {
      ...puzzle,
      placements: [...solution],
      solution, // Ensure solution is stored
    };
  }

  /**
   * Undo last action (remove last placement)
   */
  undo(puzzle: Puzzle): Puzzle {
    if (puzzle.placements.length === 0) {
      return puzzle;
    }

    const lastPlacement = puzzle.placements[puzzle.placements.length - 1];
    return removePlacementFromPuzzle(lastPlacement.row, lastPlacement.col, puzzle);
  }

  /**
   * Reset puzzle (clear all placements)
   */
  reset(puzzle: Puzzle): Puzzle {
    return {
      ...puzzle,
      placements: [],
    };
  }

  /**
   * Move a placement from one position to another
   */
  move(
    puzzle: Puzzle,
    fromRow: number,
    fromCol: number,
    toRow: number,
    toCol: number
  ): { success: boolean; puzzle?: Puzzle; error?: string } {
    const fromPlacement = getPlacementForCell(fromRow, fromCol, puzzle.placements);
    if (!fromPlacement) {
      return { success: false, error: 'No placement found at source position' };
    }

    const result = movePlacementInPuzzle(puzzle, fromPlacement, { row: toRow, col: toCol });
    
    if (result.success && result.puzzle) {
      return { success: true, puzzle: result.puzzle };
    }

    return { success: false, error: result.error || 'Move failed' };
  }

  /**
   * Rotate a placement (horizontal <-> vertical)
   */
  rotate(puzzle: Puzzle, row: number, col: number): { success: boolean; puzzle?: Puzzle; error?: string } {
    const placement = getPlacementForCell(row, col, puzzle.placements);
    if (!placement) {
      return { success: false, error: 'No placement found at position' };
    }

    const updatedPuzzle = rotatePlacementInPuzzle(puzzle, placement);
    return { success: true, puzzle: updatedPuzzle };
  }

  /**
   * Validate the current puzzle state
   */
  validate(puzzle: Puzzle): ValidationResult {
    return validatePuzzleEngine(puzzle);
  }

  /**
   * Add a placement to the puzzle
   */
  addPlacement(
    puzzle: Puzzle,
    dominoId: string,
    cell: CellPosition,
    orientation: 'horizontal' | 'vertical'
  ): { success: boolean; puzzle?: Puzzle; error?: string } {
    const result = createPlacementWithOrientation(dominoId, cell, orientation, puzzle);
    
    if (result.success && result.placement) {
      const updatedPuzzle = addPlacementToPuzzle(puzzle, result.placement);
      return { success: true, puzzle: updatedPuzzle };
    }

    return { success: false, error: result.error || 'Placement failed' };
  }

  /**
   * Remove a placement from the puzzle
   */
  removePlacement(puzzle: Puzzle, row: number, col: number): Puzzle {
    return removePlacementFromPuzzle(row, col, puzzle);
  }
}

// Singleton instance
export const gameController = new GameController();

