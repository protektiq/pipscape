import { v4 as uuidv4 } from 'uuid';
import type { Puzzle, Region, Cell, Domino } from '../types/puzzle';
import { GRID_SIZE, RuleType } from '../types/puzzle';

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

// Create regions based on difficulty
const createRegions = (difficulty: 'easy' | 'medium' | 'hard', random: SeededRandom): Region[] => {
  const regions: Region[] = [];
  const usedCells = new Set<string>();

  // Helper to check if cell is available
  const isCellAvailable = (row: number, col: number): boolean => {
    return row >= 0 && row < GRID_SIZE && 
           col >= 0 && col < GRID_SIZE &&
           !usedCells.has(`${row}-${col}`);
  };

  // Helper to mark cells as used
  const markCellsUsed = (cells: Cell[]) => {
    cells.forEach(cell => usedCells.add(`${cell.row}-${cell.col}`));
  };

  // Determine number of regions based on difficulty
  let numRegions: number;
  let minRegionSize: number;
  let maxRegionSize: number;

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
      maxRegionSize = 6;
      break;
  }

  // Generate rectangular regions
  for (let i = 0; i < numRegions && usedCells.size < GRID_SIZE * GRID_SIZE; i++) {
    const regionId = `region-${i}`;
    const regionSize = random.randomInt(minRegionSize, maxRegionSize);
    const cells: Cell[] = [];

    // Try to find a starting cell
    let startRow = random.randomInt(0, GRID_SIZE - 1);
    let startCol = random.randomInt(0, GRID_SIZE - 1);
    let attempts = 0;

    while (!isCellAvailable(startRow, startCol) && attempts < 50) {
      startRow = random.randomInt(0, GRID_SIZE - 1);
      startCol = random.randomInt(0, GRID_SIZE - 1);
      attempts++;
    }

    if (!isCellAvailable(startRow, startCol)) {
      // Find any available cell
      for (let r = 0; r < GRID_SIZE && cells.length === 0; r++) {
        for (let c = 0; c < GRID_SIZE && cells.length === 0; c++) {
          if (isCellAvailable(r, c)) {
            startRow = r;
            startCol = c;
            break;
          }
        }
      }
    }

    if (!isCellAvailable(startRow, startCol)) {
      continue; // Skip if no available cells
    }

    // Build region using flood-fill approach
    const queue: Cell[] = [{ row: startRow, col: startCol }];
    const visited = new Set<string>();

    while (queue.length > 0 && cells.length < regionSize && usedCells.size < GRID_SIZE * GRID_SIZE) {
      const current = queue.shift()!;
      const key = `${current.row}-${current.col}`;

      if (visited.has(key) || !isCellAvailable(current.row, current.col)) {
        continue;
      }

      visited.add(key);
      cells.push(current);

      // Add neighbors to queue
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
      
      // Assign rule based on difficulty
      const rule = assignRule(regionId, cells.length, difficulty, random);
      
      regions.push({
        id: regionId,
        cells,
        rule,
      });
    }
  }

  // Fill any remaining cells into a final region
  const remainingCells: Cell[] = [];
  for (let row = 0; row < GRID_SIZE; row++) {
    for (let col = 0; col < GRID_SIZE; col++) {
      if (!usedCells.has(`${row}-${col}`)) {
        remainingCells.push({ row, col });
      }
    }
  }

  if (remainingCells.length > 0) {
    const rule = assignRule(`region-${regions.length}`, remainingCells.length, difficulty, random);
    regions.push({
      id: `region-${regions.length}`,
      cells: remainingCells,
      rule,
    });
  }

  return regions;
};

// Assign rule to a region based on difficulty
const assignRule = (
  regionId: string,
  regionSize: number,
  difficulty: 'easy' | 'medium' | 'hard',
  random: SeededRandom
) => {
  // Estimate average pips per cell (dominoes average ~3-4 pips per cell)
  const avgPipsPerCell = 3.5;
  const estimatedSum = Math.floor(regionSize * avgPipsPerCell);

  // Adjust based on difficulty
  let minSum: number;
  let maxSum: number;

  switch (difficulty) {
    case 'easy':
      // Easier: wider range, lower minimum
      minSum = Math.floor(estimatedSum * 0.7);
      maxSum = Math.floor(estimatedSum * 1.3);
      break;
    case 'medium':
      minSum = Math.floor(estimatedSum * 0.8);
      maxSum = Math.floor(estimatedSum * 1.2);
      break;
    case 'hard':
      minSum = Math.floor(estimatedSum * 0.9);
      maxSum = Math.floor(estimatedSum * 1.1);
      break;
  }

  // Randomly choose SUM_AT_LEAST or SUM_AT_MOST
  const ruleType: RuleType = random.next() < 0.5 
    ? RuleType.SUM_AT_LEAST 
    : RuleType.SUM_AT_MOST;

  const value = ruleType === RuleType.SUM_AT_LEAST 
    ? random.randomInt(minSum, estimatedSum)
    : random.randomInt(estimatedSum, maxSum);

  return {
    regionId,
    type: ruleType,
    value,
  };
};

// Main puzzle generation function
export const generatePuzzle = (
  difficulty: 'easy' | 'medium' | 'hard',
  seed?: string
): Puzzle => {
  const puzzleSeed = seed || uuidv4();
  const random = new SeededRandom(puzzleSeed);
  const puzzleId = uuidv4();

  const regions = createRegions(difficulty, random);
  const availableDominoes = generateDominoSet();

  return {
    id: puzzleId,
    seed: puzzleSeed,
    difficulty,
    gridSize: GRID_SIZE,
    regions,
    availableDominoes,
    placements: [],
    createdAt: Date.now(),
  };
};

