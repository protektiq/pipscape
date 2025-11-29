// Tests for puzzle generation

import { describe, it, expect } from 'vitest';
import { generatePuzzle } from '../../../engine/generator';
import type { Puzzle } from '../../../types/puzzle';

describe('Puzzle Generator', () => {
  it('should generate a valid puzzle for easy difficulty', () => {
    const puzzle = generatePuzzle('easy', 'test-seed-1');
    
    expect(puzzle).toBeDefined();
    expect(puzzle.difficulty).toBe('easy');
    expect(puzzle.cells.length).toBeGreaterThan(0);
    expect(puzzle.cells.length % 2).toBe(0); // Must be even for domino tiling
    expect(puzzle.regions.length).toBeGreaterThan(0);
    expect(puzzle.rows).toBeGreaterThan(0);
    expect(puzzle.cols).toBeGreaterThan(0);
    expect(puzzle.shapeTemplate).toBeDefined();
  });

  it('should generate puzzles with template reference', () => {
    const puzzle = generatePuzzle('medium', 'test-seed-2');
    
    expect(puzzle.shapeTemplate).toBeDefined();
    expect(puzzle.shapeTemplate?.difficulty).toBe('medium');
    expect(puzzle.shapeTemplate?.id).toBeDefined();
  });

  it('should generate reproducible puzzles with same seed', () => {
    const puzzle1 = generatePuzzle('easy', 'reproducible-seed');
    const puzzle2 = generatePuzzle('easy', 'reproducible-seed');
    
    expect(puzzle1.cells.length).toBe(puzzle2.cells.length);
    expect(puzzle1.regions.length).toBe(puzzle2.regions.length);
    expect(puzzle1.rows).toBe(puzzle2.rows);
    expect(puzzle1.cols).toBe(puzzle2.cols);
  });

  it('should generate puzzles with solution', () => {
    const puzzle = generatePuzzle('hard', 'test-seed-3');
    
    expect(puzzle.solution).toBeDefined();
    expect(puzzle.solution?.length).toBeGreaterThan(0);
    expect(puzzle.solution?.length).toBe(puzzle.cells.length / 2); // Each domino covers 2 cells
  });
});

