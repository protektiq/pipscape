import { generatePuzzle } from '../generator';
import { generateDominoSet } from '../generator';
import type { Puzzle, Cell, Region, Domino } from '../../types/puzzle';
import { v4 as uuidv4 } from 'uuid';
import { RuleType } from '../../types/puzzle';

// Type definition for test environment globals
interface TestEnvironmentGlobals {
  __PIPSCAPE_TEST_MODE__?: boolean;
}

// Set a global flag to indicate we're in test mode
// This is checked by the generator to use faster settings
if (typeof globalThis !== 'undefined') {
  (globalThis as typeof globalThis & TestEnvironmentGlobals).__PIPSCAPE_TEST_MODE__ = true;
}

// Cache for puzzle generation to avoid regenerating the same puzzle multiple times
const puzzleCache = new Map<string, Puzzle>();

/**
 * Create a minimal test puzzle fixture without expensive generation.
 * Use this for tests that only need basic puzzle structure.
 */
export const createMinimalTestPuzzle = (
  difficulty: 'easy' | 'medium' | 'hard' = 'easy',
  seed: string = 'test-minimal'
): Puzzle => {
  // Create a simple 3x3 grid with minimal cells and regions
  const cells: Cell[] = [
    { row: 0, col: 0, regionId: 'region-1' },
    { row: 0, col: 1, regionId: 'region-1' },
    { row: 0, col: 2, regionId: 'region-2' },
    { row: 1, col: 0, regionId: 'region-2' },
    { row: 1, col: 1, regionId: 'region-2' },
    { row: 1, col: 2, regionId: 'region-3' },
    { row: 2, col: 0, regionId: 'region-3' },
    { row: 2, col: 1, regionId: 'region-3' },
  ];

  const regions: Region[] = [
    {
      id: 'region-1',
      cells: cells.filter(c => c.regionId === 'region-1'),
      rule: {
        regionId: 'region-1',
        type: RuleType.SUM_EQUALS,
        value: 10,
      },
    },
    {
      id: 'region-2',
      cells: cells.filter(c => c.regionId === 'region-2'),
      rule: {
        regionId: 'region-2',
        type: RuleType.SUM_EQUALS,
        value: 15,
      },
    },
    {
      id: 'region-3',
      cells: cells.filter(c => c.regionId === 'region-3'),
      rule: {
        regionId: 'region-3',
        type: RuleType.SUM_EQUALS,
        value: 12,
      },
    },
  ];

  const allDominoes = generateDominoSet();
  // Use first few dominoes as available
  const availableDominoes: Domino[] = allDominoes.slice(0, 4);

  return {
    id: uuidv4(),
    seed,
    difficulty,
    rows: 3,
    cols: 3,
    cells,
    regions,
    availableDominoes,
    placements: [],
    createdAt: Date.now(),
  };
};

/**
 * Get a puzzle from cache or generate it if not cached.
 * This dramatically speeds up tests by avoiding redundant expensive puzzle generation.
 * Uses test mode for faster generation.
 */
export const getCachedPuzzle = (
  difficulty: 'easy' | 'medium' | 'hard',
  seed: string
): Puzzle => {
  const cacheKey = `${difficulty}-${seed}`;
  
  if (puzzleCache.has(cacheKey)) {
    // Return a deep copy to avoid mutations affecting other tests
    const cached = puzzleCache.get(cacheKey)!;
    return {
      ...cached,
      cells: [...cached.cells],
      regions: cached.regions.map(r => ({
        ...r,
        cells: [...r.cells],
        rule: { ...r.rule },
      })),
      availableDominoes: [...cached.availableDominoes],
      placements: [...cached.placements],
    };
  }
  
  // Generate puzzle - test mode is automatically detected by generator
  // Vitest sets import.meta.env.MODE to 'test' which the generator detects
  const puzzle = generatePuzzle(difficulty, seed);
  puzzleCache.set(cacheKey, puzzle);
  
  // Return a deep copy
  return {
    ...puzzle,
    cells: [...puzzle.cells],
    regions: puzzle.regions.map(r => ({
      ...r,
      cells: [...r.cells],
      rule: { ...r.rule },
    })),
    availableDominoes: [...puzzle.availableDominoes],
    placements: [...puzzle.placements],
  };
};

/**
 * Clear the puzzle cache (useful for test cleanup)
 */
export const clearPuzzleCache = (): void => {
  puzzleCache.clear();
};

