import { v4 as uuidv4 } from 'uuid';
import type { Puzzle, Region, Cell, Domino, Placement } from '../types/puzzle';
import { validatePuzzle } from './validator';
import { getRandomTemplate, type ShapeTemplate } from './templates';

// Simple seeded random number generator for reproducibility
class SeededRandom {
  private seed: number;

  constructor(seed: string) {
    this.seed = this.hashString(seed);
  }

  private hashString(str: string): number {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    return Math.abs(hash);
  }

  next(): number {
    this.seed = (this.seed * 9301 + 49297) % 233280;
    return this.seed / 233280;
  }

  randomInt(min: number, max: number): number {
    return Math.floor(this.next() * (max - min + 1)) + min;
  }
}

// Generate all unique dominoes (0-0 through 6-6, excluding duplicates like 1-2 and 2-1)
export const generateDominoSet = (): Domino[] => {
  const dominoes: Domino[] = [];
  let id = 0;

  for (let left = 0; left <= 6; left++) {
    for (let right = left; right <= 6; right++) {
      dominoes.push({
        id: `domino-${id++}`,
        left,
        right,
      });
    }
  }

  return dominoes;
};

// Get template for difficulty (replaces getGridSizeForDifficulty)
// This is now handled by getRandomTemplate from templates.ts

// Generate a valid domino placement solution for sparse cells
const generateSolution = (
  cells: Cell[],
  random: SeededRandom
): { placements: Placement[]; usedDominoes: Domino[] } => {
  const allDominoes = generateDominoSet();
  
  const placements: Placement[] = [];
  const usedDominoIds = new Set<string>();
  const coveredCells = new Set<string>();
  
  // Create a map of active cells for quick lookup
  const activeCells = new Map<string, Cell>();
  for (const cell of cells) {
    activeCells.set(`${cell.row}-${cell.col}`, cell);
  }
  
  const getCellKey = (row: number, col: number) => `${row}-${col}`;
  const isCellActive = (row: number, col: number) => activeCells.has(getCellKey(row, col));
  const isCellCovered = (row: number, col: number) => coveredCells.has(getCellKey(row, col));
  
  // Shuffle dominoes for randomness
  const shuffledDominoes = [...allDominoes].sort(() => random.next() - 0.5);
  
  // Simple greedy placement: iterate through active cells
  for (const cell of cells) {
    const { row, col } = cell;
    if (isCellCovered(row, col)) continue;
    
    // Try horizontal first
    if (isCellActive(row, col + 1) && !isCellCovered(row, col + 1)) {
      // Find an unused domino
      for (const domino of shuffledDominoes) {
        if (usedDominoIds.has(domino.id)) continue;
        
        placements.push({
          id: `${domino.id}-${row}-${col}`,
          dominoId: domino.id,
          row,
          col,
          orientation: 'horizontal',
          fixed: false,
        });
        usedDominoIds.add(domino.id);
        coveredCells.add(getCellKey(row, col));
        coveredCells.add(getCellKey(row, col + 1));
        break;
      }
    } else if (isCellActive(row + 1, col) && !isCellCovered(row + 1, col)) {
      // Try vertical
      for (const domino of shuffledDominoes) {
        if (usedDominoIds.has(domino.id)) continue;
        
        placements.push({
          id: `${domino.id}-${row}-${col}`,
          dominoId: domino.id,
          row,
          col,
          orientation: 'vertical',
          fixed: false,
        });
        usedDominoIds.add(domino.id);
        coveredCells.add(getCellKey(row, col));
        coveredCells.add(getCellKey(row + 1, col));
        break;
      }
    }
  }
  
  const usedDominoes = allDominoes.filter(d => usedDominoIds.has(d.id));
  return { placements, usedDominoes };
};

// Create regions from template (regions are already defined in template)
const createRegionsFromTemplate = (
  template: ShapeTemplate,
  cells: Cell[]
): Region[] => {
  // Create regions from template - template already defines which cells belong to which region
  const regions: Region[] = [];
  
  // Group cells by regionId
  const cellsByRegion = new Map<string, Cell[]>();
  for (const cell of cells) {
    if (!cellsByRegion.has(cell.regionId)) {
      cellsByRegion.set(cell.regionId, []);
    }
    cellsByRegion.get(cell.regionId)!.push(cell);
  }
  
  // Create Region objects from template rules
  for (const rule of template.regions) {
    const regionCells = cellsByRegion.get(rule.regionId) || [];
    if (regionCells.length > 0) {
      regions.push({
        id: rule.regionId,
        cells: regionCells,
        rule,
      });
    }
  }
  
  return regions;
};

// assignRuleFromSolution removed - templates now define rules directly

// Validate puzzle structure for sparse grid
const validatePuzzleStructure = (regions: Region[], cells: Cell[], rows: number, cols: number): boolean => {
  // Create set of active cells
  const activeCells = new Set<string>();
  for (const cell of cells) {
    activeCells.add(`${cell.row}-${cell.col}`);
  }
  
  const coveredCells = new Set<string>();
  
  for (const region of regions) {
    for (const cell of region.cells) {
      // Check bounds
      if (cell.row < 0 || cell.row >= rows || 
          cell.col < 0 || cell.col >= cols) {
        return false;
      }
      
      // Check that cell exists in active cells
      const cellKey = `${cell.row}-${cell.col}`;
      if (!activeCells.has(cellKey)) {
        return false;
      }
      
      // Check for duplicates
      if (coveredCells.has(cellKey)) {
        return false;
      }
      coveredCells.add(cellKey);
    }
    
    if (region.rule.value < 0) {
      return false;
    }
  }
  
  // All active cells must be covered by regions
  return coveredCells.size === activeCells.size;
};

// Main puzzle generation function - solution-first approach
export const generatePuzzle = (
  difficulty: 'easy' | 'medium' | 'hard',
  seed?: string,
  originalSeed?: string,
  retryCount: number = 0,
  isFallback: boolean = false
): Puzzle => {
  // Preserve the original seed for the final puzzle, but use a modified seed for generation
  const originalPuzzleSeed = originalSeed || seed || uuidv4();
  // Check if we have an explicit seed (provided by user, not generated)
  // An explicit seed is one that was provided in the initial call (retryCount === 0 and seed is provided)
  // or one that was preserved through originalSeed
  const hasExplicitSeed = originalSeed !== undefined || (seed !== undefined && retryCount === 0 && !isFallback);
  // For reproducibility: use the original seed on first attempt, then modify for retries
  // Always preserve originalPuzzleSeed in the returned puzzle
  // Only use retry seed if we don't have an explicit seed (to preserve reproducibility)
  const workingSeed = (!hasExplicitSeed && retryCount > 0) 
    ? `${originalPuzzleSeed}-retry-${retryCount}` 
    : originalPuzzleSeed;
  const random = new SeededRandom(workingSeed);
  const puzzleId = uuidv4();

  // Step 1: Select a random template for the difficulty
  const template = getRandomTemplate(difficulty, random);
  
  // Step 2: Convert template cells to Cell[] format
  const cells: Cell[] = template.cells.map(c => ({
    row: c.row,
    col: c.col,
    regionId: c.regionId,
  }));
  
  // Step 3: Generate a valid solution for the sparse cells
  const { placements, usedDominoes } = generateSolution(cells, random);
  
  // Step 4: Create regions from template
  const regions = createRegionsFromTemplate(template, cells);
  
  // Step 5: Validate structure
  if (!validatePuzzleStructure(regions, cells, template.rows, template.cols)) {
    // If validation fails and we have an explicit seed, don't retry (preserves reproducibility)
    // Only retry if no seed was provided (random generation)
    if (!hasExplicitSeed && retryCount < 10) {
      return generatePuzzle(difficulty, originalPuzzleSeed, originalPuzzleSeed, retryCount + 1);
    }
    // For explicit seeds, if validation fails, use a deterministic fallback seed
    // This ensures reproducibility even when validation fails
    // Use isFallback flag to prevent infinite recursion
    if (isFallback) {
      // If fallback also fails, create a minimal valid puzzle with original seed preserved
      return {
        id: puzzleId,
        seed: originalPuzzleSeed,
        difficulty,
        rows: template.rows,
        cols: template.cols,
        cells: [],
        regions: [], // Empty regions - will need to be fixed by generation logic
        availableDominoes: [], // Empty dominoes - will be set by fallback generation
        placements: [],
        createdAt: Date.now(),
      };
    }
    const fallbackSeed = hasExplicitSeed 
      ? `${originalPuzzleSeed}-structure-fallback`
      : uuidv4();
    const fallbackPuzzle = generatePuzzle(difficulty, fallbackSeed, originalPuzzleSeed, 0, true);
    // Preserve the original seed even when using fallback
    return {
      ...fallbackPuzzle,
      seed: originalPuzzleSeed,
    };
  }
  
  // Step 6: Verify the solution satisfies all constraints
  const tempPuzzle: Puzzle = {
    id: puzzleId,
    seed: originalPuzzleSeed, // Always use the original seed for the puzzle
    difficulty,
    rows: template.rows,
    cols: template.cols,
    cells,
    regions,
    availableDominoes: usedDominoes, // Only include dominoes used in the solution
    placements,
    createdAt: Date.now(),
  };
  
  const validation = validatePuzzle(tempPuzzle);
  if (!validation.isValid) {
    // If solution doesn't satisfy constraints and we have an explicit seed, don't retry (preserves reproducibility)
    if (!hasExplicitSeed && retryCount < 10) {
      return generatePuzzle(difficulty, originalPuzzleSeed, originalPuzzleSeed, retryCount + 1);
    }
    // For explicit seeds, if validation fails, use a deterministic fallback seed
    // This ensures reproducibility even when validation fails
    // Use isFallback flag to prevent infinite recursion
    if (isFallback) {
      // If fallback also fails, just return the invalid puzzle with original seed preserved
      return {
        ...tempPuzzle,
        placements: [],
        seed: originalPuzzleSeed,
      };
    }
    const fallbackSeed = hasExplicitSeed
      ? `${originalPuzzleSeed}-validation-fallback`
      : uuidv4();
    const fallbackPuzzle = generatePuzzle(difficulty, fallbackSeed, originalPuzzleSeed, 0, true);
    // Preserve the original seed even when using fallback
    return {
      ...fallbackPuzzle,
      seed: originalPuzzleSeed,
    };
  }

  // Return puzzle with solution removed (for player to solve) and all dominoes
  return {
    ...tempPuzzle,
    placements: [], // Remove solution placements
    solution: placements, // Store original solution for solve button
  };
};
