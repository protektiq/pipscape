// Validation controller - handles puzzle validation logic

import type { Puzzle, ValidationResult } from '../../types/puzzle';
import { validatePuzzle as validatePuzzleEngine } from '../../engine/validator';

export class ValidationController {
  /**
   * Validate the current puzzle state
   */
  validate(puzzle: Puzzle): ValidationResult {
    return validatePuzzleEngine(puzzle);
  }

  /**
   * Check if puzzle is complete (all cells have placements)
   */
  isComplete(puzzle: Puzzle): boolean {
    const placedCells = new Set<string>();
    
    for (const placement of puzzle.placements) {
      const cells = this.getPlacementCells(placement);
      for (const cell of cells) {
        placedCells.add(`${cell.row}-${cell.col}`);
      }
    }

    // Check if all puzzle cells are covered
    for (const cell of puzzle.cells) {
      if (!placedCells.has(`${cell.row}-${cell.col}`)) {
        return false;
      }
    }

    return true;
  }

  /**
   * Get cells covered by a placement (helper)
   */
  private getPlacementCells(placement: { row: number; col: number; orientation: 'horizontal' | 'vertical' }): Array<{ row: number; col: number }> {
    const cells = [{ row: placement.row, col: placement.col }];
    
    if (placement.orientation === 'horizontal') {
      cells.push({ row: placement.row, col: placement.col + 1 });
    } else {
      cells.push({ row: placement.row + 1, col: placement.col });
    }
    
    return cells;
  }
}

export const validationController = new ValidationController();

