// Tests for GameController

import { describe, it, expect, beforeEach } from 'vitest';
import { gameController } from '../GameController';
import { generatePuzzle } from '../../../engine/generator';
import type { Puzzle } from '../../../types/puzzle';

describe('GameController', () => {
  let puzzle: Puzzle;

  beforeEach(() => {
    puzzle = generatePuzzle('easy', 'test-controller');
  });

  it('should solve puzzle', () => {
    const solved = gameController.solve(puzzle);
    
    expect(solved.placements.length).toBeGreaterThan(0);
    expect(solved.placements.length).toBe(puzzle.cells.length / 2);
  });

  it('should reset puzzle', () => {
    // First solve it
    const solved = gameController.solve(puzzle);
    expect(solved.placements.length).toBeGreaterThan(0);
    
    // Then reset
    const reset = gameController.reset(solved);
    expect(reset.placements.length).toBe(0);
  });

  it('should validate puzzle', () => {
    const solved = gameController.solve(puzzle);
    const validation = gameController.validate(solved);
    
    expect(validation.isValid).toBe(true);
  });

  it('should rotate placement', () => {
    const solved = gameController.solve(puzzle);
    if (solved.placements.length > 0) {
      const placement = solved.placements[0];
      const originalOrientation = placement.orientation;
      
      const result = gameController.rotate(solved, placement.row, placement.col);
      
      if (result.success && result.puzzle) {
        const updated = result.puzzle.placements.find(p => p.id === placement.id);
        expect(updated).toBeDefined();
        if (updated) {
          expect(updated.orientation).not.toBe(originalOrientation);
        }
      }
    }
  });
});

