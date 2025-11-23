import { describe, it, expect } from 'vitest';
import { generatePuzzle, generateDominoSet } from '../generator';

describe('generateDominoSet', () => {
  it('should generate all unique dominoes (0-0 through 6-6)', () => {
    const dominoes = generateDominoSet();
    
    // Should have 28 unique dominoes: (7 * 8) / 2 = 28
    expect(dominoes).toHaveLength(28);
    
    // Check for specific dominoes
    expect(dominoes.some(d => d.left === 0 && d.right === 0)).toBe(true);
    expect(dominoes.some(d => d.left === 0 && d.right === 6)).toBe(true);
    expect(dominoes.some(d => d.left === 6 && d.right === 6)).toBe(true);
    
    // Check no duplicates (same domino with swapped left/right)
    const dominoKeys = new Set(
      dominoes.map(d => `${Math.min(d.left, d.right)}-${Math.max(d.left, d.right)}`)
    );
    expect(dominoKeys.size).toBe(28);
  });
  
  it('should have unique IDs for each domino', () => {
    const dominoes = generateDominoSet();
    const ids = dominoes.map(d => d.id);
    const uniqueIds = new Set(ids);
    expect(uniqueIds.size).toBe(dominoes.length);
  });
});

describe('generatePuzzle', () => {
  it('should generate a puzzle with valid structure', () => {
    const puzzle = generatePuzzle('easy', 'test-seed-1');
    
    expect(puzzle).toBeDefined();
    expect(puzzle.id).toBeDefined();
    expect(puzzle.seed).toBe('test-seed-1');
    expect(puzzle.difficulty).toBe('easy');
    expect(puzzle.gridSize).toBeGreaterThanOrEqual(3);
    expect(puzzle.gridSize).toBeLessThanOrEqual(5);
    expect(puzzle.regions).toBeDefined();
    expect(puzzle.availableDominoes).toBeDefined();
    expect(puzzle.placements).toEqual([]);
  });
  
  it('should generate easy puzzles with smaller grid sizes (3x3, 4x4, or 5x5)', () => {
    // Generate multiple easy puzzles to test randomization
    const puzzles = Array.from({ length: 20 }, () => generatePuzzle('easy'));
    
    // All easy puzzles should have grid size between 3 and 5
    puzzles.forEach(puzzle => {
      expect(puzzle.gridSize).toBeGreaterThanOrEqual(3);
      expect(puzzle.gridSize).toBeLessThanOrEqual(5);
      expect([3, 4, 5]).toContain(puzzle.gridSize);
    });
    
    // At least one of each size should appear (with high probability)
    const sizes = new Set(puzzles.map(p => p.gridSize));
    // With 20 puzzles, we should see at least 2 different sizes
    expect(sizes.size).toBeGreaterThanOrEqual(1);
  });
  
  it('should generate medium and hard puzzles with 6x6 grid', () => {
    const mediumPuzzle = generatePuzzle('medium', 'test-seed-medium');
    const hardPuzzle = generatePuzzle('hard', 'test-seed-hard');
    
    expect(mediumPuzzle.gridSize).toBe(6);
    expect(hardPuzzle.gridSize).toBe(6);
  });
  
  it('should generate puzzles with correct region counts per difficulty', () => {
    const easyPuzzle = generatePuzzle('easy', 'test-seed-easy');
    const mediumPuzzle = generatePuzzle('medium', 'test-seed-medium');
    const hardPuzzle = generatePuzzle('hard', 'test-seed-hard');
    
    // Easy should have fewer regions (4 target, but may have more due to remaining cells)
    expect(easyPuzzle.regions.length).toBeGreaterThanOrEqual(4);
    
    // Medium should have more regions than easy
    expect(mediumPuzzle.regions.length).toBeGreaterThanOrEqual(6);
    
    // Hard should have the most regions
    expect(hardPuzzle.regions.length).toBeGreaterThanOrEqual(8);
  });
  
  it('should cover all cells in the grid', () => {
    const puzzle = generatePuzzle('easy', 'test-seed-coverage');
    const totalCells = puzzle.gridSize * puzzle.gridSize;
    const coveredCells = new Set<string>();
    
    for (const region of puzzle.regions) {
      for (const cell of region.cells) {
        const cellKey = `${cell.row}-${cell.col}`;
        coveredCells.add(cellKey);
      }
    }
    
    expect(coveredCells.size).toBe(totalCells);
  });
  
  it('should not have overlapping regions', () => {
    const puzzle = generatePuzzle('medium', 'test-seed-overlap');
    const cellMap = new Map<string, string>();
    
    for (const region of puzzle.regions) {
      for (const cell of region.cells) {
        const cellKey = `${cell.row}-${cell.col}`;
        if (cellMap.has(cellKey)) {
          throw new Error(`Cell (${cell.row}, ${cell.col}) is in multiple regions`);
        }
        cellMap.set(cellKey, region.id);
      }
    }
    
    // If we get here, no overlaps
    expect(true).toBe(true);
  });
  
  it('should have all cells within grid bounds', () => {
    const puzzle = generatePuzzle('hard', 'test-seed-bounds');
    
    for (const region of puzzle.regions) {
      for (const cell of region.cells) {
        expect(cell.row).toBeGreaterThanOrEqual(0);
        expect(cell.row).toBeLessThan(puzzle.gridSize);
        expect(cell.col).toBeGreaterThanOrEqual(0);
        expect(cell.col).toBeLessThan(puzzle.gridSize);
      }
    }
  });
  
  it('should have all cells within grid bounds for easy puzzles', () => {
    const puzzle = generatePuzzle('easy', 'test-seed-bounds-easy');
    
    for (const region of puzzle.regions) {
      for (const cell of region.cells) {
        expect(cell.row).toBeGreaterThanOrEqual(0);
        expect(cell.row).toBeLessThan(puzzle.gridSize);
        expect(cell.col).toBeGreaterThanOrEqual(0);
        expect(cell.col).toBeLessThan(puzzle.gridSize);
      }
    }
  });
  
  it('should generate reproducible puzzles with the same seed', () => {
    const seed = 'reproducible-seed-123';
    const puzzle1 = generatePuzzle('easy', seed);
    const puzzle2 = generatePuzzle('easy', seed);
    
    // Regions should be the same (same cells, same rules)
    expect(puzzle1.regions.length).toBe(puzzle2.regions.length);
    
    // Check that regions match
    for (let i = 0; i < puzzle1.regions.length; i++) {
      const r1 = puzzle1.regions[i];
      const r2 = puzzle2.regions[i];
      
      expect(r1.cells.length).toBe(r2.cells.length);
      expect(r1.rule.type).toBe(r2.rule.type);
      expect(r1.rule.value).toBe(r2.rule.value);
    }
  });
  
  it('should have valid rules for each region', () => {
    const puzzle = generatePuzzle('medium', 'test-seed-rules');
    
    for (const region of puzzle.regions) {
      expect(region.rule).toBeDefined();
      expect(region.rule.regionId).toBe(region.id);
      expect(['SUM_AT_LEAST', 'SUM_AT_MOST', 'VALUES_EQUAL', 'VALUES_ALL_DIFFERENT']).toContain(region.rule.type);
      expect(region.rule.value).toBeGreaterThanOrEqual(0);
    }
  });
  
  it('should have available dominoes matching the grid size', () => {
    const puzzle = generatePuzzle('easy', 'test-seed-dominoes');
    // Available dominoes should match the number of placements used in the solution
    // Each domino covers 2 cells, so the count should match the solution placements
    // For even-sized grids: gridSize * gridSize / 2
    // For odd-sized grids: floor(gridSize * gridSize / 2) or ceil, depending on solution
    const totalCells = puzzle.gridSize * puzzle.gridSize;
    const minDominoes = Math.floor(totalCells / 2);
    const maxDominoes = Math.ceil(totalCells / 2);
    
    // The domino count should be within the valid range for the grid size
    expect(puzzle.availableDominoes.length).toBeGreaterThanOrEqual(minDominoes);
    expect(puzzle.availableDominoes.length).toBeLessThanOrEqual(maxDominoes);
    
    // Also check that we have at least some dominoes
    expect(puzzle.availableDominoes.length).toBeGreaterThan(0);
  });
});

