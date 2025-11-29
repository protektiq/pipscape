import { generatePuzzle } from './generator';
import type { Puzzle } from '../types/puzzle';
import { solutionCache } from './solutionCache';

// Web Worker manager for puzzle generation
class PuzzleWorkerManager {
  private worker: Worker | null = null;
  private pendingRequests: Map<string, {
    resolve: (puzzle: Puzzle) => void;
    reject: (error: Error) => void;
  }> = new Map();
  private requestIdCounter = 0;

  private getWorker(): Worker {
    if (!this.worker) {
      // Create worker using Vite's worker import
      this.worker = new Worker(
        new URL('../workers/puzzleWorker.ts', import.meta.url),
        { type: 'module' }
      );

      this.worker.onmessage = (event) => {
        const response = event.data;
        const request = this.pendingRequests.get(response.requestId);
        
        if (request) {
          this.pendingRequests.delete(response.requestId);
          
          if (response.type === 'success') {
            request.resolve(response.puzzle);
          } else {
            request.reject(new Error(response.error));
          }
        }
      };

      this.worker.onerror = (error) => {
        console.error('Worker error:', error);
        // Reject all pending requests
        for (const request of this.pendingRequests.values()) {
          request.reject(new Error('Worker error occurred'));
        }
        this.pendingRequests.clear();
      };
    }

    return this.worker;
  }

  async generatePuzzle(difficulty: 'easy' | 'medium' | 'hard', seed?: string): Promise<Puzzle> {
    const requestId = `req-${++this.requestIdCounter}`;
    
    return new Promise((resolve, reject) => {
      this.pendingRequests.set(requestId, { resolve, reject });
      
      try {
        const worker = this.getWorker();
        worker.postMessage({
          type: 'generate',
          difficulty,
          seed,
          requestId,
        });
      } catch (error) {
        this.pendingRequests.delete(requestId);
        reject(error instanceof Error ? error : new Error('Failed to send message to worker'));
      }
    });
  }

  terminate(): void {
    if (this.worker) {
      this.worker.terminate();
      this.worker = null;
      this.pendingRequests.clear();
    }
  }
}

// Puzzle pool to pre-generate puzzles for instant serving
class PuzzlePool {
  private pools: Map<string, Puzzle[]> = new Map();
  private generating: Set<string> = new Set();
  private readonly POOL_SIZE = 3; // Smaller pool for faster initial fill
  private readonly MIN_POOL_SIZE = 1; // Regenerate when pool is empty
  private workerManager: PuzzleWorkerManager = new PuzzleWorkerManager();

  private getPoolKey(difficulty: 'easy' | 'medium' | 'hard'): string {
    return difficulty;
  }

  /**
   * Get a puzzle from the pool, or generate one if pool is empty
   */
  getPuzzle(difficulty: 'easy' | 'medium' | 'hard', seed?: string): Promise<Puzzle> {
    // If seed is provided, generate on-demand (for reproducibility)
    // Use synchronous generation for seed-based puzzles to ensure exact reproducibility
    if (seed) {
      // Try generating with the seed, with limited retries to avoid infinite loops
      let puzzle: Puzzle | null = null;
      let attempts = 0;
      const maxAttempts = 3;
      
      while (attempts < maxAttempts && (!puzzle || !puzzle.solution)) {
        try {
          const currentSeed = attempts === 0 ? seed : `${seed}-retry-${attempts}-${Date.now()}`;
          puzzle = generatePuzzle(difficulty, currentSeed);
          attempts++;
        } catch (error) {
          attempts++;
          if (attempts >= maxAttempts) {
            throw new Error(`Failed to generate puzzle with solution after ${maxAttempts} attempts for ${difficulty}: ${error instanceof Error ? error.message : 'Unknown error'}`);
          }
        }
      }
      
      if (!puzzle || !puzzle.solution) {
        throw new Error(`Failed to generate puzzle with solution after ${maxAttempts} attempts for ${difficulty}`);
      }
      
      // Cache the solution
      solutionCache.set(puzzle.seed, puzzle.solution);
      return Promise.resolve(puzzle);
    }

    const poolKey = this.getPoolKey(difficulty);
    console.log(`[PuzzlePool.getPuzzle] Requested difficulty: ${difficulty}, poolKey: ${poolKey}`);
    const pool = this.pools.get(poolKey) || [];
    console.log(`[PuzzlePool.getPuzzle] Pool size for ${poolKey}: ${pool.length}`);

    // If pool has puzzles, return one and refill in background
    if (pool.length > 0) {
      const puzzle = pool.pop()!;
      console.log(`[PuzzlePool.getPuzzle] Returning puzzle from pool: id=${puzzle.id}, difficulty=${puzzle.difficulty}, requested=${difficulty}`);
      this.pools.set(poolKey, pool);
      
      // Refill pool in background if it's getting low
      if (pool.length < this.MIN_POOL_SIZE && !this.generating.has(poolKey)) {
        this.refillPool(difficulty).catch(console.error);
      }
      
      return Promise.resolve(puzzle);
    }

    // Pool is empty - generate INSTANTLY and SYNCHRONOUSLY
    // Wrap in Promise.resolve to make it async-compatible but execute immediately
    console.log(`[PuzzlePool] Pool empty for ${difficulty}, generating puzzle synchronously...`);
    return Promise.resolve().then(() => {
      try {
        const startTime = Date.now();
        console.log(`[PuzzlePool] Calling generatePuzzle(${difficulty})...`);
        const puzzle = generatePuzzle(difficulty);
        const generationTime = Date.now() - startTime;
        console.log(`[PuzzlePool] Puzzle generated in ${generationTime}ms: id=${puzzle.id}, difficulty=${puzzle.difficulty}, requested=${difficulty}`);
        
        if (!puzzle || !puzzle.solution) {
          console.error(`[PuzzlePool] Generated puzzle has no solution!`, puzzle);
          throw new Error('Generated puzzle has no solution');
        }
        
        console.log(`[PuzzlePool] Puzzle generated successfully with ${puzzle.solution.length} placements, difficulty=${puzzle.difficulty}`);
        solutionCache.set(puzzle.seed, puzzle.solution);
        // Don't refill pool during initial request - it can cause issues
        // Pool will be refilled later in background if needed
        return puzzle;
      } catch (error) {
        // If generation fails, try with a guaranteed seed
        console.warn('[PuzzlePool] Initial generation failed, trying with guaranteed seed:', error);
        try {
          const fallbackSeed = `${difficulty}-instant-${Date.now()}`;
          const fallbackPuzzle = generatePuzzle(difficulty, fallbackSeed);
          
          if (!fallbackPuzzle || !fallbackPuzzle.solution) {
            throw new Error('Fallback puzzle has no solution');
          }
          
          console.log(`[PuzzlePool] Fallback puzzle generated successfully`);
          solutionCache.set(fallbackPuzzle.seed, fallbackPuzzle.solution);
          // Don't refill pool during initial request
          return fallbackPuzzle;
        } catch (fallbackError) {
          // This should never happen with our guaranteed fallback template
          console.error(`[PuzzlePool] Fallback generation also failed:`, fallbackError);
          throw new Error(`Failed to generate puzzle for ${difficulty}: ${fallbackError instanceof Error ? fallbackError.message : 'Unknown error'}`);
        }
      }
    });
  }

  /**
   * Refill the pool in the background using simple synchronous generation
   * This runs truly in the background and doesn't block
   */
  private async refillPool(difficulty: 'easy' | 'medium' | 'hard'): Promise<void> {
    const poolKey = this.getPoolKey(difficulty);
    
    if (this.generating.has(poolKey)) {
      return; // Already generating
    }

    this.generating.add(poolKey);

    try {
      const pool = this.pools.get(poolKey) || [];
      const needed = this.POOL_SIZE - pool.length;

      if (needed <= 0) {
        this.generating.delete(poolKey);
        return;
      }

      // Generate puzzles using simple synchronous generation
      // Use setTimeout to yield to event loop between generations
      const newPuzzles: Puzzle[] = [];
      
      for (let i = 0; i < needed; i++) {
        // Yield to event loop between each generation to keep UI responsive
        await new Promise(resolve => setTimeout(resolve, 0));
        
        try {
          const puzzle = generatePuzzle(difficulty);
          if (puzzle && puzzle.solution) {
            solutionCache.set(puzzle.seed, puzzle.solution);
            newPuzzles.push(puzzle);
          }
        } catch (error) {
          // Silently skip failed generations - pool will just have fewer puzzles
          console.debug(`Failed to generate puzzle ${i + 1}/${needed} for ${difficulty} pool:`, error);
        }
      }
      
      // Only add successfully generated puzzles to the pool
      if (newPuzzles.length > 0) {
        pool.push(...newPuzzles);
        this.pools.set(poolKey, pool);
      }
    } catch (error) {
      console.error(`Failed to refill puzzle pool for ${difficulty}:`, error);
    } finally {
      this.generating.delete(poolKey);
    }
  }

  /**
   * Pre-generate at least one puzzle per difficulty immediately for instant loading
   * Generates puzzles in parallel, prioritizing getting at least one ready quickly
   */
  async pregenerateAll(): Promise<void> {
    const difficulties: Array<'easy' | 'medium' | 'hard'> = ['easy', 'medium', 'hard'];
    
    // Generate at least one puzzle per difficulty immediately using fast synchronous generation
    // This ensures puzzles are ready instantly when user clicks
    for (const diff of difficulties) {
      // Use setTimeout to yield to event loop between difficulties
      setTimeout(() => {
        // Try to generate one puzzle synchronously for instant availability
        try {
          const puzzle = generatePuzzle(diff);
          if (puzzle && puzzle.solution) {
            const poolKey = this.getPoolKey(diff);
            const pool = this.pools.get(poolKey) || [];
            pool.push(puzzle);
            this.pools.set(poolKey, pool);
            solutionCache.set(puzzle.seed, puzzle.solution);
            console.debug(`Pre-generated ${diff} puzzle for instant loading`);
          }
        } catch (error) {
          // If sync fails, start async generation
          console.debug(`Sync pregeneration failed for ${diff}, starting async:`, error);
        }
        
        // Also start async refill in background to fill the pool
        this.refillPool(diff).catch((error) => {
          console.debug(`Async pregeneration failed for ${diff}:`, error);
        });
      }, 0);
    }
  }

  /**
   * Clear the pool (useful for testing)
   */
  clear(): void {
    this.pools.clear();
    this.generating.clear();
  }

  /**
   * Terminate worker (useful for cleanup)
   */
  terminate(): void {
    this.workerManager.terminate();
  }
}

// Singleton instance
export const puzzlePool = new PuzzlePool();

