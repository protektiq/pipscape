import { create } from 'zustand';
import type { Puzzle, Cell, ValidationResult } from '../types/puzzle';
import { generatePuzzle } from '../engine/generator';
import { validatePuzzle as validatePuzzleEngine } from '../engine/validator';
import { 
  handleFirstCellClick, 
  handleSecondCellClick, 
  addPlacementToPuzzle, 
  removePlacementFromPuzzle,
  isDominoPlaced,
  rotatePlacementInPuzzle,
  movePlacementInPuzzle,
} from '../engine/placementEngine';
import { getPlacementCells, getPlacementForCell } from '../engine/placementUtils';

type PlacementMode = 'select-domino' | 'place-first' | 'place-second';

interface PuzzleState {
  currentPuzzle: Puzzle | null;
  selectedDominoId: string | null;
  placementMode: PlacementMode;
  firstCell: Cell | null;
  validationResult: ValidationResult | null;
  invalidPlacementMessage: string | null;

  // Actions
  generatePuzzle: (difficulty: 'easy' | 'medium' | 'hard', seed?: string) => void;
  selectDomino: (dominoId: string) => void;
  placeDomino: (cell: Cell) => void;
  removePlacement: (row: number, col: number) => void;
  rotatePlacement: (row: number, col: number) => void;
  movePlacement: (fromRow: number, fromCol: number, toRow: number, toCol: number) => void;
  clearSelection: () => void;
  validateSolution: () => void;
  setPuzzle: (puzzle: Puzzle) => void;
  clearInvalidPlacementMessage: () => void;
}

export const usePuzzleStore = create<PuzzleState>((set, get) => ({
  currentPuzzle: null,
  selectedDominoId: null,
  placementMode: 'select-domino',
  firstCell: null,
  validationResult: null,
  invalidPlacementMessage: null,

  generatePuzzle: (difficulty, seed) => {
    const puzzle = generatePuzzle(difficulty, seed);
    set({
      currentPuzzle: puzzle,
      selectedDominoId: null,
      placementMode: 'select-domino',
      firstCell: null,
      validationResult: null,
      invalidPlacementMessage: null,
    });
  },

  selectDomino: (dominoId) => {
    const state = get();
    if (state.currentPuzzle) {
      // Check if domino is already placed
      const placed = isDominoPlaced(dominoId, state.currentPuzzle);

      if (!placed) {
        set({
          selectedDominoId: dominoId,
          placementMode: 'place-first',
          firstCell: null,
        });
      }
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
    } else if (state.placementMode === 'place-second' && state.firstCell) {
      // Second cell clicked
      const result = handleSecondCellClick(
        state.firstCell,
        cell,
        state.selectedDominoId,
        state.currentPuzzle
      );

      if (result.success && result.placement) {
        // Add placement
        const updatedPuzzle = addPlacementToPuzzle(state.currentPuzzle, result.placement);

        set({
          currentPuzzle: updatedPuzzle,
          selectedDominoId: null,
          placementMode: 'select-domino',
          firstCell: null,
          invalidPlacementMessage: null,
        });
      } else {
        // Invalid placement, show message and reset
        set({
          selectedDominoId: null,
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

    const updatedPuzzle = removePlacementFromPuzzle(row, col, state.currentPuzzle);

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

    const placement = getPlacementForCell(row, col, state.currentPuzzle.placements);
    if (!placement) {
      return;
    }

    const updatedPuzzle = rotatePlacementInPuzzle(state.currentPuzzle, placement);

    set({
      currentPuzzle: updatedPuzzle,
      validationResult: null,
    });
  },

  movePlacement: (fromRow, fromCol, toRow, toCol) => {
    const state = get();
    if (!state.currentPuzzle) {
      return;
    }

    const fromPlacement = getPlacementForCell(fromRow, fromCol, state.currentPuzzle.placements);
    if (!fromPlacement) {
      return;
    }

    const result = movePlacementInPuzzle(
      state.currentPuzzle,
      fromPlacement,
      { row: toRow, col: toCol }
    );

    if (result.success && result.puzzle) {
      set({
        currentPuzzle: result.puzzle,
        validationResult: null,
      });
    }
    // If move failed, silently ignore (could show error message in future)
  },

  clearSelection: () => {
    set({
      selectedDominoId: null,
      placementMode: 'select-domino',
      firstCell: null,
      invalidPlacementMessage: null,
    });
  },

  clearInvalidPlacementMessage: () => {
    set({ invalidPlacementMessage: null });
  },

  validateSolution: () => {
    const state = get();
    if (!state.currentPuzzle) {
      return;
    }

    const result = validatePuzzleEngine(state.currentPuzzle);
    set({ validationResult: result });
  },

  setPuzzle: (puzzle) => {
    set({
      currentPuzzle: puzzle,
      selectedDominoId: null,
      placementMode: 'select-domino',
      firstCell: null,
      validationResult: null,
      invalidPlacementMessage: null,
    });
  },
}));
