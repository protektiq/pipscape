import { create } from 'zustand';
import type { Puzzle, CellPosition, ValidationResult, Placement } from '../types/puzzle';
import { generatePuzzle } from '../engine/generator';
import { validatePuzzle as validatePuzzleEngine } from '../engine/validator';
import { 
  handleFirstCellClick, 
  addPlacementToPuzzle, 
  removePlacementFromPuzzle,
  isDominoPlaced,
  rotatePlacementInPuzzle,
  movePlacementInPuzzle,
  createPlacementWithOrientation,
} from '../engine/placementEngine';
import { getPlacementCells, getPlacementForCell } from '../engine/placementUtils';

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

  // Actions
  generatePuzzle: (difficulty: 'easy' | 'medium' | 'hard', seed?: string) => void;
  selectDomino: (dominoId: string) => void;
  rotateSelectedDomino: () => void;
  createPlacementFromTray: (dominoId: string, cell: CellPosition) => void;
  placeDomino: (cell: CellPosition) => void;
  removePlacement: (row: number, col: number) => void;
  rotatePlacement: (row: number, col: number) => void;
  movePlacement: (fromRow: number, fromCol: number, toRow: number, toCol: number) => void;
  clearSelection: () => void;
  validateSolution: () => void;
  setPlacements: (placements: Placement[]) => void;
  solvePuzzle: () => void;
  setPuzzle: (puzzle: Puzzle) => void;
  clearInvalidPlacementMessage: () => void;
}

export const usePuzzleStore = create<PuzzleState>((set, get) => ({
  currentPuzzle: null,
  selectedDominoId: null,
  selectedOrientation: 'horizontal',
  placementMode: 'select-domino',
  firstCell: null,
  validationResult: null,
  invalidPlacementMessage: null,

  generatePuzzle: (difficulty, seed) => {
    const puzzle = generatePuzzle(difficulty, seed);
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

  selectDomino: (dominoId) => {
    const state = get();
    if (state.currentPuzzle) {
      // Check if domino is already placed
      const placed = isDominoPlaced(dominoId, state.currentPuzzle);

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
    const placed = isDominoPlaced(dominoId, state.currentPuzzle);
    if (placed) {
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

    // Create placement with selected orientation
    const result = createPlacementWithOrientation(
      dominoId,
      cell,
      state.selectedOrientation,
      state.currentPuzzle
    );

    if (result.success && result.placement) {
      const updatedPuzzle = addPlacementToPuzzle(state.currentPuzzle, result.placement);
      set({
        currentPuzzle: updatedPuzzle,
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
    } else if (state.placementMode === 'place-second' && state.firstCell) {
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

      // Create placement using selectedOrientation
      const result = createPlacementWithOrientation(
        state.selectedDominoId,
        state.firstCell,
        state.selectedOrientation,
        state.currentPuzzle
      );

      if (result.success && result.placement) {
        // Add placement
        const updatedPuzzle = addPlacementToPuzzle(state.currentPuzzle, result.placement);

        set({
          currentPuzzle: updatedPuzzle,
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
      selectedOrientation: 'horizontal',
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
    if (!state.currentPuzzle || !state.currentPuzzle.solution) {
      return;
    }

    console.log('Solve placements', state.currentPuzzle.solution);

    // Simply update placements with solution - let the board render from placements
    set({
      currentPuzzle: {
        ...state.currentPuzzle,
        placements: [...state.currentPuzzle.solution],
      },
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
}));
