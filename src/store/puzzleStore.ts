import { useMemo } from 'react';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Puzzle, CellPosition, ValidationResult, Placement } from '../types/puzzle';
import { puzzlePool } from '../engine/puzzlePool';
import { solutionCache } from '../engine/solutionCache';
import { gameController } from '../lib/game/GameController';
import { placementController } from '../lib/game/placementController';
import { validationController } from '../lib/game/validationController';
import { handleFirstCellClick } from '../engine/placementEngine';
import { getPlacementCells } from '../engine/placementUtils';

type PlacementMode = 'select-domino' | 'place-first' | 'place-second';

type Orientation = 'horizontal' | 'vertical';

interface PuzzleState {
  currentPuzzle: Puzzle | null;
  selectedDominoId: string | null;
  selectedOrientation: Orientation;
  placementMode: PlacementMode;
  firstCell: CellPosition | null;
  validationResult: ValidationResult | null;
  invalidPlacementMessage: string | null;
  generationError: string | null;

  // Actions
  generatePuzzle: (difficulty: 'easy' | 'medium' | 'hard', seed?: string) => Promise<void>;
  isGenerating: boolean;
  selectDomino: (dominoId: string) => void;
  rotateSelectedDomino: () => void;
  createPlacementFromTray: (dominoId: string, cell: CellPosition) => void;
  placeDomino: (cell: CellPosition) => void;
  removePlacement: (row: number, col: number) => void;
  rotatePlacement: (row: number, col: number) => void;
  movePlacement: (fromRow: number, fromCol: number, toRow: number, toCol: number) => void;
  undo: () => void;
  reset: () => void;
  clearSelection: () => void;
  validateSolution: () => void;
  setPlacements: (placements: Placement[]) => void;
  solvePuzzle: () => void;
  setPuzzle: (puzzle: Puzzle) => void;
  clearInvalidPlacementMessage: () => void;
  clearGenerationError: () => void;
}

export const usePuzzleStore = create<PuzzleState>()(
  persist(
    (set, get) => ({
      currentPuzzle: null,
      selectedDominoId: null,
      selectedOrientation: 'horizontal',
      placementMode: 'select-domino',
      firstCell: null,
      validationResult: null,
      invalidPlacementMessage: null,
      isGenerating: false,
      generationError: null,

  generatePuzzle: async (difficulty, seed) => {
    console.log(`[PuzzleStore] Starting puzzle generation for ${difficulty}`, seed ? `with seed: ${seed}` : '');
    set({ isGenerating: true, generationError: null });
    
    try {
      // Get puzzle directly - generation is now fast and synchronous
      // No timeouts, no promise racing - just get it
      console.log(`[PuzzleStore] Calling puzzlePool.getPuzzle...`);
      const puzzle = await puzzlePool.getPuzzle(difficulty, seed);
      console.log(`[PuzzleStore] Got puzzle from pool:`, puzzle ? `id=${puzzle.id}, solution=${puzzle.solution?.length || 0} placements` : 'null');
      
      // Validate puzzle has solution
      if (!puzzle.solution) {
        throw new Error(`Puzzle received without solution from puzzlePool for ${difficulty}`);
      }
      
      // Ensure solution is cached
      solutionCache.set(puzzle.seed, puzzle.solution);
      
      // Set puzzle immediately - no delays
      set({
        currentPuzzle: puzzle,
        selectedDominoId: null,
        selectedOrientation: 'horizontal',
        placementMode: 'select-domino',
        firstCell: null,
        validationResult: null,
        invalidPlacementMessage: null,
        isGenerating: false,
      });
    } catch (error) {
      console.error('Failed to generate puzzle:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      
      // Try one immediate fallback with a unique seed
      try {
        const fallbackSeed = `${difficulty}-fallback-${Date.now()}-${Math.random()}`;
        const fallbackPuzzle = await puzzlePool.getPuzzle(difficulty, fallbackSeed);
        
        if (!fallbackPuzzle.solution) {
          throw new Error('Fallback puzzle has no solution');
        }
        
        solutionCache.set(fallbackPuzzle.seed, fallbackPuzzle.solution);
        
        set({
          currentPuzzle: fallbackPuzzle,
          selectedDominoId: null,
          selectedOrientation: 'horizontal',
          placementMode: 'select-domino',
          firstCell: null,
          validationResult: null,
          invalidPlacementMessage: null,
          isGenerating: false,
        });
      } catch (fallbackError) {
        // Both attempts failed
        console.error('Fallback generation also failed:', fallbackError);
        set({ 
          isGenerating: false,
          generationError: `Unable to generate puzzle: ${errorMessage}. Please try again.`,
        });
      }
    }
  },

  selectDomino: (dominoId) => {
    const state = get();
    if (state.currentPuzzle) {
      // Check if domino is already placed
      const placed = placementController.isDominoPlaced(state.currentPuzzle, dominoId);

      if (!placed) {
        set({
          selectedDominoId: dominoId,
          selectedOrientation: 'horizontal',
          placementMode: 'place-first',
          firstCell: null,
        });
      }
    }
  },

  rotateSelectedDomino: () => {
    const state = get();
    if (state.selectedDominoId) {
      set({
        selectedOrientation: state.selectedOrientation === 'horizontal' ? 'vertical' : 'horizontal',
      });
    }
  },

  createPlacementFromTray: (dominoId, cell) => {
    const state = get();
    if (!state.currentPuzzle) {
      return;
    }

    // Check if domino is already placed
    const placed = placementController.isDominoPlaced(state.currentPuzzle, dominoId);
    if (placed) {
      return;
    }

    // Check if cell already has a placement
    if (placementController.hasPlacement(state.currentPuzzle, cell.row, cell.col)) {
      return;
    }

    // Use GameController to create placement
    const result = gameController.addPlacement(
      state.currentPuzzle,
      dominoId,
      cell,
      state.selectedOrientation
    );

    if (result.success && result.puzzle) {
      set({
        currentPuzzle: result.puzzle,
        selectedDominoId: null,
        selectedOrientation: 'horizontal',
        placementMode: 'select-domino',
        firstCell: null,
        invalidPlacementMessage: null,
      });
    } else {
      // Invalid placement, show message
      set({
        invalidPlacementMessage: result.error || 'Invalid placement. Please try again.',
      });
      
      // Clear message after 3 seconds
      setTimeout(() => {
        const currentState = get();
        if (currentState.invalidPlacementMessage) {
          set({ invalidPlacementMessage: null });
        }
      }, 3000);
    }
  },

  placeDomino: (cell) => {
    const state = get();
    if (!state.currentPuzzle || !state.selectedDominoId) {
      return;
    }

    // Check if cell already has a placement
    const hasPlacement = state.currentPuzzle.placements.some(p => {
      const cells = getPlacementCells(p);
      return cells.some(c => c.row === cell.row && c.col === cell.col);
    });

    if (hasPlacement) {
      return;
    }

    if (state.placementMode === 'place-first') {
      // First cell clicked
      const result = handleFirstCellClick(cell);
      set({
        firstCell: result.firstCell,
        placementMode: result.mode,
      });
    } else     if (state.placementMode === 'place-second' && state.firstCell) {
      // Second cell clicked - use selectedOrientation to determine valid placement
      // Check if the clicked cell matches the selected orientation
      const rowDiff = cell.row - state.firstCell.row;
      const colDiff = cell.col - state.firstCell.col;
      
      // Check if cells are adjacent
      if (Math.abs(rowDiff) + Math.abs(colDiff) !== 1) {
        // Not adjacent, treat as new first cell
        const result = handleFirstCellClick(cell);
        set({
          firstCell: result.firstCell,
          placementMode: result.mode,
        });
        return;
      }

      // Check if the clicked cell matches the selected orientation
      const clickedOrientation = colDiff !== 0 ? 'horizontal' : 'vertical';
      if (clickedOrientation !== state.selectedOrientation) {
        // Orientation doesn't match, show error and reset
        set({
          selectedDominoId: null,
          selectedOrientation: 'horizontal',
          placementMode: 'select-domino',
          firstCell: null,
          invalidPlacementMessage: `Please click a cell that matches the ${state.selectedOrientation} orientation.`,
        });
        
        setTimeout(() => {
          const currentState = get();
          if (currentState.invalidPlacementMessage) {
            set({ invalidPlacementMessage: null });
          }
        }, 3000);
        return;
      }

      // Use GameController to create placement
      const result = gameController.addPlacement(
        state.currentPuzzle,
        state.selectedDominoId,
        state.firstCell,
        state.selectedOrientation
      );

      if (result.success && result.puzzle) {
        set({
          currentPuzzle: result.puzzle,
          selectedDominoId: null,
          selectedOrientation: 'horizontal',
          placementMode: 'select-domino',
          firstCell: null,
          invalidPlacementMessage: null,
        });
      } else {
        // Invalid placement, show message and reset
        set({
          selectedDominoId: null,
          selectedOrientation: 'horizontal',
          placementMode: 'select-domino',
          firstCell: null,
          invalidPlacementMessage: result.error || 'Invalid placement. Please try again.',
        });
        
        // Clear message after 3 seconds
        setTimeout(() => {
          const currentState = get();
          if (currentState.invalidPlacementMessage) {
            set({ invalidPlacementMessage: null });
          }
        }, 3000);
      }
    }
  },

  removePlacement: (row, col) => {
    const state = get();
    if (!state.currentPuzzle) {
      return;
    }

    const updatedPuzzle = gameController.removePlacement(state.currentPuzzle, row, col);

    set({
      currentPuzzle: updatedPuzzle,
      validationResult: null,
    });
  },

  rotatePlacement: (row, col) => {
    const state = get();
    if (!state.currentPuzzle) {
      return;
    }

    const result = gameController.rotate(state.currentPuzzle, row, col);
    
    if (result.success && result.puzzle) {
      set({
        currentPuzzle: result.puzzle,
        validationResult: null,
      });
    }
  },

  movePlacement: (fromRow, fromCol, toRow, toCol) => {
    const state = get();
    if (!state.currentPuzzle) {
      return;
    }

    const result = gameController.move(
      state.currentPuzzle,
      fromRow,
      fromCol,
      toRow,
      toCol
    );

    if (result.success && result.puzzle) {
      set({
        currentPuzzle: result.puzzle,
        validationResult: null,
      });
    }
    // If move failed, silently ignore (could show error message in future)
  },

  undo: () => {
    const state = get();
    if (!state.currentPuzzle) {
      return;
    }

    const updatedPuzzle = gameController.undo(state.currentPuzzle);
    set({
      currentPuzzle: updatedPuzzle,
      validationResult: null,
    });
  },

  reset: () => {
    const state = get();
    if (!state.currentPuzzle) {
      return;
    }

    const updatedPuzzle = gameController.reset(state.currentPuzzle);
    set({
      currentPuzzle: updatedPuzzle,
      validationResult: null,
    });
  },

  clearSelection: () => {
    set({
      selectedDominoId: null,
      selectedOrientation: 'horizontal',
      placementMode: 'select-domino',
      firstCell: null,
      invalidPlacementMessage: null,
    });
  },

  clearInvalidPlacementMessage: () => {
    set({ invalidPlacementMessage: null });
  },

  clearGenerationError: () => {
    set({ generationError: null });
  },

  validateSolution: () => {
    const state = get();
    if (!state.currentPuzzle) {
      return;
    }

    const result = validationController.validate(state.currentPuzzle);
    set({ validationResult: result });
  },

  setPlacements: (placements: Placement[]) => {
    const state = get();
    if (!state.currentPuzzle) {
      return;
    }

    set({
      currentPuzzle: {
        ...state.currentPuzzle,
        placements: [...placements],
      },
    });
  },

  solvePuzzle: () => {
    const state = get();
    if (!state.currentPuzzle) {
      return;
    }

    // Use GameController to solve
    const solvedPuzzle = gameController.solve(state.currentPuzzle);
    
    set({
      currentPuzzle: solvedPuzzle,
      selectedDominoId: null,
      selectedOrientation: 'horizontal',
      placementMode: 'select-domino',
      firstCell: null,
      validationResult: null,
      invalidPlacementMessage: null,
    });
  },

  setPuzzle: (puzzle) => {
    set({
      currentPuzzle: puzzle,
      selectedDominoId: null,
      selectedOrientation: 'horizontal',
      placementMode: 'select-domino',
      firstCell: null,
      validationResult: null,
      invalidPlacementMessage: null,
    });
  },
    }),
    {
      name: 'pipscape-puzzle-storage',
      // Only persist the puzzle state, not UI state like isGenerating
      partialize: (state) => ({
        currentPuzzle: state.currentPuzzle,
        // Don't persist UI state that should reset on reload
        // selectedDominoId, placementMode, etc. will reset to defaults
      }),
    }
  )
);

// Optimized selectors to prevent unnecessary re-renders
// Components should use these instead of destructuring the entire store
// Using individual selectors for each value to prevent object recreation

// Individual selectors for puzzle data
export const useCurrentPuzzle = () => usePuzzleStore((state) => state.currentPuzzle);
export const useIsGenerating = () => usePuzzleStore((state) => state.isGenerating);
export const useGenerationError = () => usePuzzleStore((state) => state.generationError);

// Individual selectors for placement UI state
export const usePlacementMode = () => usePuzzleStore((state) => state.placementMode);
export const useSelectedDominoId = () => usePuzzleStore((state) => state.selectedDominoId);
export const useSelectedOrientation = () => usePuzzleStore((state) => state.selectedOrientation);
export const useFirstCell = () => usePuzzleStore((state) => state.firstCell);

// Individual selectors for validation state
export const useValidationResult = () => usePuzzleStore((state) => state.validationResult);
export const useInvalidPlacementMessage = () => usePuzzleStore((state) => state.invalidPlacementMessage);

// Selector for puzzle actions - actions are stable functions, so we can safely return them
// Using useMemo to ensure stable reference
export const usePuzzleActions = () => {
  const generatePuzzle = usePuzzleStore((state) => state.generatePuzzle);
  const selectDomino = usePuzzleStore((state) => state.selectDomino);
  const rotateSelectedDomino = usePuzzleStore((state) => state.rotateSelectedDomino);
  const createPlacementFromTray = usePuzzleStore((state) => state.createPlacementFromTray);
  const placeDomino = usePuzzleStore((state) => state.placeDomino);
  const removePlacement = usePuzzleStore((state) => state.removePlacement);
  const rotatePlacement = usePuzzleStore((state) => state.rotatePlacement);
  const movePlacement = usePuzzleStore((state) => state.movePlacement);
  const undo = usePuzzleStore((state) => state.undo);
  const reset = usePuzzleStore((state) => state.reset);
  const clearSelection = usePuzzleStore((state) => state.clearSelection);
  const validateSolution = usePuzzleStore((state) => state.validateSolution);
  const setPlacements = usePuzzleStore((state) => state.setPlacements);
  const solvePuzzle = usePuzzleStore((state) => state.solvePuzzle);
  const setPuzzle = usePuzzleStore((state) => state.setPuzzle);
  const clearInvalidPlacementMessage = usePuzzleStore((state) => state.clearInvalidPlacementMessage);
  const clearGenerationError = usePuzzleStore((state) => state.clearGenerationError);

  return useMemo(
    () => ({
      generatePuzzle,
      selectDomino,
      rotateSelectedDomino,
      createPlacementFromTray,
      placeDomino,
      removePlacement,
      rotatePlacement,
      movePlacement,
      undo,
      reset,
      clearSelection,
      validateSolution,
      setPlacements,
      solvePuzzle,
      setPuzzle,
      clearInvalidPlacementMessage,
      clearGenerationError,
    }),
    [
      generatePuzzle,
      selectDomino,
      rotateSelectedDomino,
      createPlacementFromTray,
      placeDomino,
      removePlacement,
      rotatePlacement,
      movePlacement,
      undo,
      reset,
      clearSelection,
      validateSolution,
      setPlacements,
      solvePuzzle,
      setPuzzle,
      clearInvalidPlacementMessage,
      clearGenerationError,
    ]
  );
};

// Convenience selectors that combine related values (use sparingly)
// Using useMemo to prevent object recreation on every render
export const usePuzzleData = () => {
  const currentPuzzle = useCurrentPuzzle();
  const isGenerating = useIsGenerating();
  const generationError = useGenerationError();
  return useMemo(
    () => ({ currentPuzzle, isGenerating, generationError }),
    [currentPuzzle, isGenerating, generationError]
  );
};

export const usePlacementUI = () => {
  const placementMode = usePlacementMode();
  const selectedDominoId = useSelectedDominoId();
  const selectedOrientation = useSelectedOrientation();
  const firstCell = useFirstCell();
  return useMemo(
    () => ({ placementMode, selectedDominoId, selectedOrientation, firstCell }),
    [placementMode, selectedDominoId, selectedOrientation, firstCell]
  );
};

export const useValidationState = () => {
  const validationResult = useValidationResult();
  const invalidPlacementMessage = useInvalidPlacementMessage();
  return useMemo(
    () => ({ validationResult, invalidPlacementMessage }),
    [validationResult, invalidPlacementMessage]
  );
};
