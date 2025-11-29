// Tests for PlacementController

import { describe, it, expect, beforeEach } from 'vitest';
import { placementController } from '../placementController';
import { generatePuzzle } from '../../../engine/generator';
import type { Puzzle } from '../../../types/puzzle';

describe('PlacementController', () => {
  let puzzle: Puzzle;

  beforeEach(() => {
    puzzle = generatePuzzle('easy', 'test-placement');
  });

  it('should check if domino is placed', () => {
    const solved = gameController.solve(puzzle);
    
    if (solved.placements.length > 0) {
      const dominoId = solved.placements[0].dominoId;
      const isPlaced = placementController.isDominoPlaced(solved, dominoId);
      expect(isPlaced).toBe(true);
    }
  });

  it('should check if cell has placement', () => {
    const solved = gameController.solve(puzzle);
    
    if (solved.placements.length > 0) {
      const placement = solved.placements[0];
      const hasPlacement = placementController.hasPlacement(solved, placement.row, placement.col);
      expect(hasPlacement).toBe(true);
    }
  });

  it('should get placement at cell', () => {
    const solved = gameController.solve(puzzle);
    
    if (solved.placements.length > 0) {
      const placement = solved.placements[0];
      const found = placementController.getPlacement(solved, placement.row, placement.col);
      expect(found).toBeDefined();
      expect(found?.id).toBe(placement.id);
    }
  });

  it('should remove placement', () => {
    const solved = gameController.solve(puzzle);
    
    if (solved.placements.length > 0) {
      const placement = solved.placements[0];
      const updated = placementController.removePlacement(solved, placement.row, placement.col);
      
      expect(updated.placements.length).toBe(solved.placements.length - 1);
      const found = placementController.getPlacement(updated, placement.row, placement.col);
      expect(found).toBeUndefined();
    }
  });
});

// Import gameController for tests
import { gameController } from '../GameController';

