// Placement controller - handles all placement-related logic

import type { Puzzle, Placement, CellPosition } from '../../types/puzzle';
import {
  addPlacementToPuzzle,
  removePlacementFromPuzzle,
  rotatePlacementInPuzzle,
  movePlacementInPuzzle,
  createPlacementWithOrientation,
  isDominoPlaced,
} from '../../engine/placementEngine';
import { getPlacementForCell, getPlacementCells } from '../../engine/placementUtils';

export class PlacementController {
  /**
   * Check if a domino is already placed
   */
  isDominoPlaced(puzzle: Puzzle, dominoId: string): boolean {
    return isDominoPlaced(dominoId, puzzle);
  }

  /**
   * Check if a cell has a placement
   */
  hasPlacement(puzzle: Puzzle, row: number, col: number): boolean {
    return getPlacementForCell(row, col, puzzle.placements) !== undefined;
  }

  /**
   * Get placement at a cell
   */
  getPlacement(puzzle: Puzzle, row: number, col: number): Placement | undefined {
    return getPlacementForCell(row, col, puzzle.placements);
  }

  /**
   * Get all cells covered by a placement
   */
  getPlacementCells(placement: Placement): CellPosition[] {
    return getPlacementCells(placement);
  }

  /**
   * Create and add a placement
   */
  createPlacement(
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
   * Remove a placement
   */
  removePlacement(puzzle: Puzzle, row: number, col: number): Puzzle {
    return removePlacementFromPuzzle(row, col, puzzle);
  }

  /**
   * Rotate a placement
   */
  rotatePlacement(puzzle: Puzzle, row: number, col: number): Puzzle {
    const placement = getPlacementForCell(row, col, puzzle.placements);
    if (!placement) {
      return puzzle;
    }
    return rotatePlacementInPuzzle(puzzle, placement);
  }

  /**
   * Move a placement
   */
  movePlacement(
    puzzle: Puzzle,
    fromRow: number,
    fromCol: number,
    toRow: number,
    toCol: number
  ): { success: boolean; puzzle?: Puzzle; error?: string } {
    const fromPlacement = getPlacementForCell(fromRow, fromCol, puzzle.placements);
    if (!fromPlacement) {
      return { success: false, error: 'No placement found' };
    }

    const result = movePlacementInPuzzle(puzzle, fromPlacement, { row: toRow, col: toCol });
    
    if (result.success && result.puzzle) {
      return { success: true, puzzle: result.puzzle };
    }

    return { success: false, error: result.error || 'Move failed' };
  }
}

export const placementController = new PlacementController();

