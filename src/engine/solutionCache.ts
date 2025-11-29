import type { Placement } from '../types/puzzle';

// Solution cache that maps puzzle seed to solution placements
// Using seed as key ensures deterministic caching (same seed = same puzzle = same solution)
class SolutionCache {
  private cache: Map<string, Placement[]> = new Map();
  private readonly MAX_CACHE_SIZE = 1000; // Limit cache size to prevent memory issues

  /**
   * Get solution for a puzzle by seed
   */
  get(seed: string): Placement[] | undefined {
    return this.cache.get(seed);
  }

  /**
   * Store solution for a puzzle by seed
   */
  set(seed: string, solution: Placement[]): void {
    // If cache is getting too large, remove oldest entries (simple FIFO)
    if (this.cache.size >= this.MAX_CACHE_SIZE) {
      const firstKey = this.cache.keys().next().value;
      if (firstKey) {
        this.cache.delete(firstKey);
      }
    }
    this.cache.set(seed, solution);
  }

  /**
   * Check if solution exists for a seed
   */
  has(seed: string): boolean {
    return this.cache.has(seed);
  }

  /**
   * Clear the cache
   */
  clear(): void {
    this.cache.clear();
  }

  /**
   * Get cache size
   */
  size(): number {
    return this.cache.size;
  }

  /**
   * Pre-populate cache with solutions from puzzles
   */
  prePopulate(puzzles: Array<{ seed: string; solution?: Placement[] }>): void {
    for (const puzzle of puzzles) {
      if (puzzle.solution) {
        this.set(puzzle.seed, puzzle.solution);
      }
    }
  }
}

// Singleton instance
export const solutionCache = new SolutionCache();

