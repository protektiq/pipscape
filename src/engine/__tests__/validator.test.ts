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
    // Find a valid cell that exists and has a neighbor for placement
    const validCell = puzzle.cells.find(cell => {
      // Check if there's a horizontal neighbor
      const neighbor = puzzle.cells.find(c => 
        c.row === cell.row && c.col === cell.col + 1
      );
      return neighbor !== undefined;
    });
    
    if (!validCell) {
      // Skip test if no valid cells found
      return;
    }
    
    const placement: Placement = {
      dominoId: puzzle.availableDominoes[0].id,
      row: validCell.row,
      col: validCell.col,
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
      col: puzzle.cols - 1,
      orientation: 'horizontal',
    };
    
    const result = validatePlacement(puzzle, placement);
    expect(result.isValid).toBe(false);
    expect(result.error).toBe('Placement is out of bounds or cell does not exist');
  });
  
  it('should reject placement out of bounds (bottom edge)', () => {
    const placement: Placement = {
      dominoId: puzzle.availableDominoes[0].id,
      row: puzzle.rows - 1,
      col: 0,
      orientation: 'vertical',
    };
    
    const result = validatePlacement(puzzle, placement);
    expect(result.isValid).toBe(false);
    expect(result.error).toBe('Placement is out of bounds or cell does not exist');
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
    expect(result.error).toBe('Placement is out of bounds or cell does not exist');
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
    expect(result.error).toBe('Placement is out of bounds or cell does not exist');
  });
  
  it('should reject duplicate domino placement', () => {
    // Find a valid cell that exists and has a horizontal neighbor
    const validCell = puzzle.cells.find(cell => {
      const neighbor = puzzle.cells.find(c => 
        c.row === cell.row && c.col === cell.col + 1
      );
      return neighbor !== undefined;
    });
    
    if (!validCell) {
      // Skip test if no valid cells found
      return;
    }
    
    const placement: Placement = {
      dominoId: puzzle.availableDominoes[0].id,
      row: validCell.row,
      col: validCell.col,
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
    // Find a valid cell that exists and has a horizontal neighbor
    const validCell = puzzle.cells.find(cell => {
      const neighbor = puzzle.cells.find(c => 
        c.row === cell.row && c.col === cell.col + 1
      );
      return neighbor !== undefined;
    });
    
    if (!validCell) {
      // Skip test if no valid cells found
      return;
    }
    
    const placement1: Placement = {
      dominoId: puzzle.availableDominoes[0].id,
      row: validCell.row,
      col: validCell.col,
      orientation: 'horizontal',
    };
    
    const placement2: Placement = {
      dominoId: puzzle.availableDominoes[1].id,
      row: validCell.row,
      col: validCell.col + 1,
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
    // Find a valid cell that exists and has a horizontal neighbor
    const validCell = puzzle.cells.find(cell => {
      const neighbor = puzzle.cells.find(c => 
        c.row === cell.row && c.col === cell.col + 1
      );
      return neighbor !== undefined;
    });
    
    if (!validCell) {
      // Skip test if no valid cells found
      return;
    }
    
    const placement: Placement = {
      dominoId: 'non-existent-domino-id',
      row: validCell.row,
      col: validCell.col,
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
    expect(testPuzzle.cols).toBeGreaterThanOrEqual(4);
    
    // Find valid cells for placement (cells that exist)
    const validCells = testPuzzle.cells.filter(c => c.row === 0 && c.col < testPuzzle.cols - 1);
    if (validCells.length < 2) {
      // Skip test if not enough valid cells
      return;
    }
    
    const cell1 = validCells[0];
    const cell2 = validCells.find(c => c.row === cell1.row && c.col >= cell1.col + 2) || validCells[1];
    
    const placement1: Placement = {
      dominoId: testPuzzle.availableDominoes[0].id,
      row: cell1.row,
      col: cell1.col,
      orientation: 'horizontal',
    };
    
    const placement2: Placement = {
      dominoId: testPuzzle.availableDominoes[1].id,
      row: cell2.row,
      col: cell2.col,
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

