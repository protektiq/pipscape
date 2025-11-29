import { generatePuzzle } from '../engine/generator';
import type { Puzzle } from '../types/puzzle';

// Message types for worker communication
type WorkerMessage = 
  | { type: 'generate'; difficulty: 'easy' | 'medium' | 'hard'; seed?: string; requestId: string }
  | { type: 'cancel'; requestId: string };

type WorkerResponse =
  | { type: 'success'; puzzle: Puzzle; requestId: string }
  | { type: 'error'; error: string; requestId: string };

// Handle messages from main thread
// In Web Worker context, 'self' refers to the worker global scope
const ctx = self as unknown as {
  onmessage: ((event: MessageEvent<WorkerMessage>) => void) | null;
  postMessage: (message: WorkerResponse) => void;
};

ctx.onmessage = (event: MessageEvent<WorkerMessage>) => {
  const message = event.data;

  if (message.type === 'generate') {
    try {
      const puzzle = generatePuzzle(message.difficulty, message.seed);
      // Never return puzzles without solutions
      if (!puzzle.solution) {
        throw new Error(`Generated puzzle without solution for ${message.difficulty}`);
      }
      const response: WorkerResponse = {
        type: 'success',
        puzzle,
        requestId: message.requestId,
      };
      ctx.postMessage(response);
    } catch (error) {
      const response: WorkerResponse = {
        type: 'error',
        error: error instanceof Error ? error.message : 'Unknown error occurred',
        requestId: message.requestId,
      };
      ctx.postMessage(response);
    }
  }
  // Ignore cancel messages for now (could implement cancellation logic later)
};

// Export empty object to make this a module
export {};

