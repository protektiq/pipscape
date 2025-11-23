import { create } from 'zustand';
import type { Puzzle, Cell, ValidationResult } from '../types/puzzle';
import { generatePuzzle } from '../engine/generator';
import { validatePlacement, validatePuzzle as validatePuzzleEngine } from '../engine/validator';

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
      const isPlaced = state.currentPuzzle.placements.some(
        p => p.dominoId === dominoId
      );

      if (!isPlaced) {
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
      set({
        firstCell: cell,
        placementMode: 'place-second',
      });
    } else if (state.placementMode === 'place-second' && state.firstCell) {
      // Second cell clicked - determine orientation and place
      const rowDiff = cell.row - state.firstCell.row;
      const colDiff = cell.col - state.firstCell.col;

      // Check if cells are adjacent
      const isAdjacent = 
        (Math.abs(rowDiff) === 1 && colDiff === 0) ||
        (rowDiff === 0 && Math.abs(colDiff) === 1);

      if (!isAdjacent) {
        // Not adjacent, reset to first cell
        set({
          firstCell: cell,
          placementMode: 'place-second',
        });
        return;
      }

      // Determine orientation
      const orientation: 'horizontal' | 'vertical' = colDiff !== 0 ? 'horizontal' : 'vertical';
      
      // Ensure first cell is the leftmost/topmost
      const startRow = orientation === 'horizontal' ? state.firstCell.row : Math.min(state.firstCell.row, cell.row);
      const startCol = orientation === 'horizontal' ? Math.min(state.firstCell.col, cell.col) : state.firstCell.col;

      const placement = {
        dominoId: state.selectedDominoId,
        row: startRow,
        col: startCol,
        orientation,
        fixed: false,
      };

      // Validate placement
      const validation = validatePlacement(state.currentPuzzle, placement);
      
      if (validation.isValid) {
        // Add placement
        const updatedPuzzle = {
          ...state.currentPuzzle,
          placements: [...state.currentPuzzle.placements, placement],
        };

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
          invalidPlacementMessage: validation.error || 'Invalid placement. Please try again.',
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

    // Find placement covering this cell
    const placementIndex = state.currentPuzzle.placements.findIndex(p => {
      const cells = getPlacementCells(p);
      return cells.some(c => c.row === row && c.col === col);
    });

    if (placementIndex !== -1) {
      const updatedPlacements = [...state.currentPuzzle.placements];
      updatedPlacements.splice(placementIndex, 1);

      set({
        currentPuzzle: {
          ...state.currentPuzzle,
          placements: updatedPlacements,
        },
        validationResult: null,
      });
    }
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

// Helper function to get placement cells (duplicated from validator for store use)
const getPlacementCells = (placement: { row: number; col: number; orientation: 'horizontal' | 'vertical' }): Cell[] => {
  const cells: Cell[] = [
    { row: placement.row, col: placement.col },
  ];

  if (placement.orientation === 'horizontal') {
    cells.push({ row: placement.row, col: placement.col + 1 });
  } else {
    cells.push({ row: placement.row + 1, col: placement.col });
  }

  return cells;
};

