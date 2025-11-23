import { describe, it, expect, beforeEach } from 'vitest';
import { validatePlacement, validatePuzzle } from '../validator';
import { generatePuzzle } from '../generator';
import type { Puzzle, Placement } from '../../types/puzzle';

describe('validatePlacement', () => {
  let puzzle: Puzzle;
  
  beforeEach(() => {
    puzzle = generatePuzzle('easy', 'test-validator-seed');
  });
  
  it('should validate a valid placement', () => {
    const placement: Placement = {
      dominoId: puzzle.availableDominoes[0].id,
      row: 0,
      col: 0,
      orientation: 'horizontal',
    };
    
    const result = validatePlacement(puzzle, placement);
    expect(result.isValid).toBe(true);
    expect(result.error).toBeUndefined();
  });
  
  it('should reject placement out of bounds (right edge)', () => {
    const placement: Placement = {
      dominoId: puzzle.availableDominoes[0].id,
      row: 0,
      col: puzzle.gridSize - 1,
      orientation: 'horizontal',
    };
    
    const result = validatePlacement(puzzle, placement);
    expect(result.isValid).toBe(false);
    expect(result.error).toBe('Placement is out of bounds');
  });
  
  it('should reject placement out of bounds (bottom edge)', () => {
    const placement: Placement = {
      dominoId: puzzle.availableDominoes[0].id,
      row: puzzle.gridSize - 1,
      col: 0,
      orientation: 'vertical',
    };
    
    const result = validatePlacement(puzzle, placement);
    expect(result.isValid).toBe(false);
    expect(result.error).toBe('Placement is out of bounds');
  });
  
  it('should reject placement out of bounds (negative row)', () => {
    const placement: Placement = {
      dominoId: puzzle.availableDominoes[0].id,
      row: -1,
      col: 0,
      orientation: 'vertical',
    };
    
    const result = validatePlacement(puzzle, placement);
    expect(result.isValid).toBe(false);
    expect(result.error).toBe('Placement is out of bounds');
  });
  
  it('should reject placement out of bounds (negative col)', () => {
    const placement: Placement = {
      dominoId: puzzle.availableDominoes[0].id,
      row: 0,
      col: -1,
      orientation: 'horizontal',
    };
    
    const result = validatePlacement(puzzle, placement);
    expect(result.isValid).toBe(false);
    expect(result.error).toBe('Placement is out of bounds');
  });
  
  it('should reject duplicate domino placement', () => {
    const placement: Placement = {
      dominoId: puzzle.availableDominoes[0].id,
      row: 0,
      col: 0,
      orientation: 'horizontal',
    };
    
    // Add the placement first
    puzzle.placements.push(placement);
    
    // Try to place the same domino again
    const result = validatePlacement(puzzle, placement);
    expect(result.isValid).toBe(false);
    expect(result.error).toBe('Domino is already placed');
  });
  
  it('should reject overlapping placements', () => {
    const placement1: Placement = {
      dominoId: puzzle.availableDominoes[0].id,
      row: 0,
      col: 0,
      orientation: 'horizontal',
    };
    
    const placement2: Placement = {
      dominoId: puzzle.availableDominoes[1].id,
      row: 0,
      col: 1,
      orientation: 'horizontal',
    };
    
    // Add first placement
    puzzle.placements.push(placement1);
    
    // Try to place second domino overlapping
    const result = validatePlacement(puzzle, placement2);
    expect(result.isValid).toBe(false);
    expect(result.error).toBe('Placement overlaps with existing domino');
  });
  
  it('should reject placement with non-existent domino ID', () => {
    const placement: Placement = {
      dominoId: 'non-existent-domino-id',
      row: 0,
      col: 0,
      orientation: 'horizontal',
    };
    
    const result = validatePlacement(puzzle, placement);
    expect(result.isValid).toBe(false);
    expect(result.error).toBe('Domino not found in available dominoes');
  });
  
  it('should allow adjacent non-overlapping placements', () => {
    // Use a medium puzzle to ensure grid is large enough (6x6)
    const testPuzzle = generatePuzzle('medium', 'test-validator-adjacent-seed');
    
    // Ensure grid is large enough for the placements (need at least 4 columns)
    expect(testPuzzle.gridSize).toBeGreaterThanOrEqual(4);
    
    const placement1: Placement = {
      dominoId: testPuzzle.availableDominoes[0].id,
      row: 0,
      col: 0,
      orientation: 'horizontal',
    };
    
    const placement2: Placement = {
      dominoId: testPuzzle.availableDominoes[1].id,
      row: 0,
      col: 2,
      orientation: 'horizontal',
    };
    
    testPuzzle.placements.push(placement1);
    
    const result = validatePlacement(testPuzzle, placement2);
    expect(result.isValid).toBe(true);
    expect(result.error).toBeUndefined();
  });
});

describe('validatePuzzle', () => {
  it('should validate an empty puzzle (no placements)', () => {
    const puzzle = generatePuzzle('easy', 'test-empty-puzzle');
    const result = validatePuzzle(puzzle);
    
    // Empty puzzle should fail validation (regions need dominoes)
    expect(result).toBeDefined();
    expect(result.isValid).toBe(false);
    expect(result.invalidRegions.length).toBeGreaterThan(0);
  });
  
  it('should return validation result with correct structure', () => {
    const puzzle = generatePuzzle('medium', 'test-structure');
    const result = validatePuzzle(puzzle);
    
    expect(result).toHaveProperty('isValid');
    expect(result).toHaveProperty('invalidRegions');
    expect(result).toHaveProperty('message');
    expect(Array.isArray(result.invalidRegions)).toBe(true);
    expect(typeof result.message).toBe('string');
  });
  
  it('should identify invalid regions correctly', () => {
    const puzzle = generatePuzzle('easy', 'test-invalid-regions');
    const result = validatePuzzle(puzzle);
    
    // With no placements, all regions should be invalid
    expect(result.invalidRegions.length).toBeGreaterThan(0);
    expect(result.invalidRegions.length).toBeLessThanOrEqual(puzzle.regions.length);
    
    // Check that invalid region IDs exist in puzzle
    for (const regionId of result.invalidRegions) {
      expect(puzzle.regions.some(r => r.id === regionId)).toBe(true);
    }
  });
  
  it('should provide appropriate message for invalid puzzle', () => {
    const puzzle = generatePuzzle('hard', 'test-message');
    const result = validatePuzzle(puzzle);
    
    if (!result.isValid) {
      expect(result.message).toContain('region(s) do not satisfy');
    }
  });
});

