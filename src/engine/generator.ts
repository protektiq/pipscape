import { v4 as uuidv4 } from 'uuid';
import type { Puzzle, Region, Cell, Domino, Placement } from '../types/puzzle';
import { RuleType } from '../types/puzzle';
import { getPlacementCells } from './placementUtils';
import { getDominoValue } from './dominoUtils';
import { validatePuzzle } from './validator';

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

// Determine grid size based on difficulty
const getGridSizeForDifficulty = (difficulty: 'easy' | 'medium' | 'hard', random: SeededRandom): number => {
  if (difficulty === 'easy') {
    const sizes = [3, 4, 5];
    return sizes[random.randomInt(0, sizes.length - 1)];
  }
  return 6; // medium and hard
};

// Generate a valid domino placement solution (fast - just fills the grid)
const generateSolution = (gridSize: number, random: SeededRandom): { placements: Placement[]; usedDominoes: Domino[] } => {
  const allDominoes = generateDominoSet();
  
  const placements: Placement[] = [];
  const usedDominoIds = new Set<string>();
  const coveredCells = new Set<string>();
  
  const getCellKey = (row: number, col: number) => `${row}-${col}`;
  const isCellCovered = (row: number, col: number) => coveredCells.has(getCellKey(row, col));
  
  // Shuffle dominoes for randomness
  const shuffledDominoes = [...allDominoes].sort(() => random.next() - 0.5);
  
  // Simple greedy placement: fill grid row by row
  for (let row = 0; row < gridSize; row++) {
    for (let col = 0; col < gridSize; col++) {
      if (isCellCovered(row, col)) continue;
      
      // Try horizontal first
      if (col < gridSize - 1 && !isCellCovered(row, col + 1)) {
        // Find an unused domino
        for (const domino of shuffledDominoes) {
          if (usedDominoIds.has(domino.id)) continue;
          
          placements.push({
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
      } else if (row < gridSize - 1 && !isCellCovered(row + 1, col)) {
        // Try vertical
        for (const domino of shuffledDominoes) {
          if (usedDominoIds.has(domino.id)) continue;
          
          placements.push({
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
  }
  
  const usedDominoes = allDominoes.filter(d => usedDominoIds.has(d.id));
  return { placements, usedDominoes };
};

// Create regions from solution placements (contiguous regions using flood-fill)
const createRegionsFromSolution = (
  gridSize: number,
  placements: Placement[],
  difficulty: 'easy' | 'medium' | 'hard',
  random: SeededRandom
): Region[] => {
  // Determine number of regions based on grid size and difficulty
  let numRegions: number;
  let minRegionSize: number;
  let maxRegionSize: number;
  
  if (gridSize === 3) {
    numRegions = random.randomInt(3, 4);
    minRegionSize = 2;
    maxRegionSize = 4;
  } else if (gridSize === 4) {
    numRegions = random.randomInt(4, 5);
    minRegionSize = 3;
    maxRegionSize = 6;
  } else if (gridSize === 5) {
    numRegions = random.randomInt(4, 6);
    minRegionSize = 4;
    maxRegionSize = 8;
  } else {
    // 6x6
    switch (difficulty) {
      case 'easy':
        numRegions = 4;
        minRegionSize = 6;
        maxRegionSize = 10;
        break;
      case 'medium':
        numRegions = 6;
        minRegionSize = 4;
        maxRegionSize = 8;
        break;
      case 'hard':
        numRegions = 8;
        minRegionSize = 3;
        maxRegionSize = 5; // Smaller max to ensure we can fit 8 regions in 36 cells
        break;
    }
  }
  
  const regions: Region[] = [];
  const usedCells = new Set<string>();
  const totalCells = gridSize * gridSize;
  
  // Create a map of cell to placement
  const cellToPlacement = new Map<string, Placement>();
  for (const placement of placements) {
    const cells = getPlacementCells(placement);
    for (const cell of cells) {
      cellToPlacement.set(`${cell.row}-${cell.col}`, placement);
    }
  }
  
  const isCellAvailable = (row: number, col: number): boolean => {
    return row >= 0 && row < gridSize && 
           col >= 0 && col < gridSize &&
           !usedCells.has(`${row}-${col}`);
  };
  
  const markCellsUsed = (cells: Cell[]) => {
    cells.forEach(cell => usedCells.add(`${cell.row}-${cell.col}`));
  };
  
  // Create contiguous regions using flood-fill
  // We'll create regions one by one, ensuring we always get at least the target number
  let regionIndex = 0;
  while (regionIndex < numRegions && usedCells.size < totalCells) {
    const regionId = `region-${regionIndex}`;
    const isLastTargetRegion = regionIndex === numRegions - 1;
    const remainingCellsForRegions = totalCells - usedCells.size;
    
    // Calculate region size - last target region should use remaining cells if we're close
    let targetRegionSize: number;
    if (isLastTargetRegion && remainingCellsForRegions <= maxRegionSize) {
      targetRegionSize = remainingCellsForRegions;
    } else {
      // Ensure we leave enough cells for remaining regions
      const cellsNeededForRemaining = (numRegions - regionIndex - 1) * minRegionSize;
      const maxSizeForThisRegion = Math.min(maxRegionSize, remainingCellsForRegions - cellsNeededForRemaining);
      targetRegionSize = random.randomInt(
        Math.max(minRegionSize, maxSizeForThisRegion - 2),
        Math.max(minRegionSize, maxSizeForThisRegion)
      );
    }
    
    const cells: Cell[] = [];
    
    // Find starting cell - try random first, then search systematically
    let startRow = random.randomInt(0, gridSize - 1);
    let startCol = random.randomInt(0, gridSize - 1);
    let attempts = 0;
    
    while (!isCellAvailable(startRow, startCol) && attempts < 100) {
      startRow = random.randomInt(0, gridSize - 1);
      startCol = random.randomInt(0, gridSize - 1);
      attempts++;
    }
    
    if (!isCellAvailable(startRow, startCol)) {
      // Find any available cell systematically
      let found = false;
      for (let r = 0; r < gridSize && !found; r++) {
        for (let c = 0; c < gridSize && !found; c++) {
          if (isCellAvailable(r, c)) {
            startRow = r;
            startCol = c;
            found = true;
          }
        }
      }
      
      if (!found) {
        // No available cells - all should be covered by now
        break;
      }
    }
    
    // Flood-fill to create contiguous region
    const queue: Cell[] = [{ row: startRow, col: startCol }];
    const visited = new Set<string>();
    
    while (queue.length > 0 && cells.length < targetRegionSize && usedCells.size < totalCells) {
      const current = queue.shift()!;
      const key = `${current.row}-${current.col}`;
      
      if (visited.has(key) || !isCellAvailable(current.row, current.col)) {
        continue;
      }
      
      visited.add(key);
      cells.push(current);
      
      // Add neighbors in deterministic order (top, bottom, left, right)
      const neighbors = [
        { row: current.row - 1, col: current.col },
        { row: current.row + 1, col: current.col },
        { row: current.row, col: current.col - 1 },
        { row: current.row, col: current.col + 1 },
      ];
      
      for (const neighbor of neighbors) {
        const neighborKey = `${neighbor.row}-${neighbor.col}`;
        if (isCellAvailable(neighbor.row, neighbor.col) && !visited.has(neighborKey)) {
          queue.push(neighbor);
        }
      }
    }
    
    if (cells.length > 0) {
      markCellsUsed(cells);
      
      // Calculate actual sum from placements in this region
      const regionPlacements = new Set<Placement>();
      for (const cell of cells) {
        const placement = cellToPlacement.get(`${cell.row}-${cell.col}`);
        if (placement) {
          regionPlacements.add(placement);
        }
      }
      
      // Calculate sum of domino values in this region
      const allDominoes = generateDominoSet();
      let actualSum = 0;
      const dominoValues: number[] = [];
      for (const placement of regionPlacements) {
        const domino = allDominoes.find(d => d.id === placement.dominoId);
        if (domino) {
          const value = getDominoValue(domino);
          actualSum += value;
          dominoValues.push(value);
        }
      }
      
      // Assign rule based on actual values
      const rule = assignRuleFromSolution(regionId, cells.length, actualSum, dominoValues, difficulty, random);
      
      regions.push({
        id: regionId,
        cells,
        rule,
      });
      
      regionIndex++;
    } else {
      // If we can't create a region, we must have run out of cells
      break;
    }
  }
  
  // Handle any remaining cells
  const remainingCells: Cell[] = [];
  for (let row = 0; row < gridSize; row++) {
    for (let col = 0; col < gridSize; col++) {
      if (!usedCells.has(`${row}-${col}`)) {
        remainingCells.push({ row, col });
      }
    }
  }
  
  if (remainingCells.length > 0) {
    const allDominoes = generateDominoSet();
    const cellToPlacement = new Map<string, Placement>();
    for (const placement of placements) {
      const cells = getPlacementCells(placement);
      for (const cell of cells) {
        cellToPlacement.set(`${cell.row}-${cell.col}`, placement);
      }
    }
    
    const regionPlacements = new Set<Placement>();
    for (const cell of remainingCells) {
      const placement = cellToPlacement.get(`${cell.row}-${cell.col}`);
      if (placement) {
        regionPlacements.add(placement);
      }
    }
    
    let actualSum = 0;
    const dominoValues: number[] = [];
    for (const placement of regionPlacements) {
      const domino = allDominoes.find(d => d.id === placement.dominoId);
      if (domino) {
        const value = getDominoValue(domino);
        actualSum += value;
        dominoValues.push(value);
      }
    }
    
    const rule = assignRuleFromSolution(`region-${regions.length}`, remainingCells.length, actualSum, dominoValues, difficulty, random);
    regions.push({
      id: `region-${regions.length}`,
      cells: remainingCells,
      rule,
    });
  }
  
  return regions;
};

// Assign rule based on actual solution values
const assignRuleFromSolution = (
  regionId: string,
  regionSize: number,
  actualSum: number,
  dominoValues: number[],
  difficulty: 'easy' | 'medium' | 'hard',
  random: SeededRandom
) => {
  const canUseValueConstraints = regionSize >= 4 && dominoValues.length >= 2;
  const randomValue = random.next();
  let ruleType: RuleType;
  let value: number;
  
  if (difficulty === 'easy') {
    if (randomValue < 0.333) {
      ruleType = RuleType.SUM_AT_LEAST;
      value = Math.max(0, actualSum - random.randomInt(2, 5));
    } else if (randomValue < 0.666) {
      ruleType = RuleType.SUM_AT_MOST;
      value = actualSum + random.randomInt(2, 5);
    } else {
      if (canUseValueConstraints && dominoValues.every(v => v === dominoValues[0])) {
        ruleType = RuleType.VALUES_EQUAL;
        value = 0;
      } else {
        ruleType = RuleType.SUM_AT_LEAST;
        value = Math.max(0, actualSum - random.randomInt(2, 5));
      }
    }
  } else if (difficulty === 'medium') {
    if (randomValue < 0.12 && canUseValueConstraints) {
      const uniqueValues = new Set(dominoValues);
      if (uniqueValues.size === dominoValues.length) {
        ruleType = RuleType.VALUES_ALL_DIFFERENT;
        value = 0;
      } else {
        ruleType = RuleType.SUM_AT_LEAST;
        value = Math.max(0, actualSum - random.randomInt(1, 3));
      }
    } else if (randomValue < 0.4133) {
      ruleType = RuleType.SUM_AT_LEAST;
      value = Math.max(0, actualSum - random.randomInt(1, 3));
    } else if (randomValue < 0.7066) {
      ruleType = RuleType.SUM_AT_MOST;
      value = actualSum + random.randomInt(1, 3);
    } else {
      if (canUseValueConstraints && dominoValues.every(v => v === dominoValues[0])) {
        ruleType = RuleType.VALUES_EQUAL;
        value = 0;
      } else {
        ruleType = RuleType.SUM_AT_MOST;
        value = actualSum + random.randomInt(1, 3);
      }
    }
  } else {
    // Hard
    if (randomValue < 0.25) {
      ruleType = RuleType.SUM_AT_LEAST;
      value = Math.max(0, actualSum - random.randomInt(0, 2));
    } else if (randomValue < 0.5) {
      ruleType = RuleType.SUM_AT_MOST;
      value = actualSum + random.randomInt(0, 2);
    } else if (randomValue < 0.75) {
      if (canUseValueConstraints && dominoValues.every(v => v === dominoValues[0])) {
        ruleType = RuleType.VALUES_EQUAL;
        value = 0;
      } else {
        ruleType = RuleType.SUM_AT_LEAST;
        value = Math.max(0, actualSum - random.randomInt(0, 2));
      }
    } else {
      if (canUseValueConstraints) {
        const uniqueValues = new Set(dominoValues);
        if (uniqueValues.size === dominoValues.length) {
          ruleType = RuleType.VALUES_ALL_DIFFERENT;
          value = 0;
        } else {
          ruleType = RuleType.SUM_AT_MOST;
          value = actualSum + random.randomInt(0, 2);
        }
      } else {
        ruleType = RuleType.SUM_AT_MOST;
        value = actualSum + random.randomInt(0, 2);
      }
    }
  }
  
  return {
    regionId,
    type: ruleType,
    value,
  };
};

// Validate puzzle structure
const validatePuzzleStructure = (regions: Region[], gridSize: number): boolean => {
  const totalCells = gridSize * gridSize;
  const coveredCells = new Set<string>();
  
  for (const region of regions) {
    for (const cell of region.cells) {
      if (cell.row < 0 || cell.row >= gridSize || 
          cell.col < 0 || cell.col >= gridSize) {
        return false;
      }
      
      const cellKey = `${cell.row}-${cell.col}`;
      if (coveredCells.has(cellKey)) {
        return false;
      }
      coveredCells.add(cellKey);
    }
    
    if (region.rule.value < 0) {
      return false;
    }
  }
  
  return coveredCells.size === totalCells;
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

  // Determine grid size based on difficulty
  const gridSize = getGridSizeForDifficulty(difficulty, random);
  
  // Step 1: Generate a valid solution first (fast)
  const { placements, usedDominoes } = generateSolution(gridSize, random);
  
  // Step 2: Create regions from the solution
  const regions = createRegionsFromSolution(gridSize, placements, difficulty, random);
  
  // Step 3: Validate structure
  if (!validatePuzzleStructure(regions, gridSize)) {
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
        gridSize,
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
  
  // Step 4: Verify the solution satisfies all constraints
  const tempPuzzle: Puzzle = {
    id: puzzleId,
    seed: originalPuzzleSeed, // Always use the original seed for the puzzle
    difficulty,
    gridSize,
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
  };
};
