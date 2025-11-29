import type { Puzzle, ValidationResult } from '../types/puzzle';

interface TopBarProps {
  puzzle: Puzzle;
  validationResult: ValidationResult | null;
  invalidPlacementMessage: string | null;
  placementMode: 'select-domino' | 'place-first' | 'place-second';
  selectedDominoId: string | null;
  onGoHome: () => void;
  onOpenModal: () => void;
  onNewPuzzle: () => void;
  onPrint: () => void;
  onCheckSolution: () => void;
  onSolve: () => void;
  onClearInvalidMessage: () => void;
}

const TopBar = ({
  puzzle,
  validationResult,
  invalidPlacementMessage,
  placementMode,
  selectedDominoId,
  onGoHome,
  onOpenModal,
  onNewPuzzle,
  onPrint,
  onCheckSolution,
  onSolve,
  onClearInvalidMessage,
}: TopBarProps) => {
  return (
    <div className="mb-4 sm:mb-6 flex flex-col gap-3 sm:gap-4">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">PIPSCAPE</h1>
          <p className="text-sm sm:text-base text-gray-600 capitalize">
            Difficulty: {puzzle.difficulty}
          </p>
        </div>
        <div className="flex flex-wrap gap-2 w-full sm:w-auto">
          <button
            onClick={onGoHome}
            className="flex-1 sm:flex-none min-h-[44px] px-4 py-2 bg-indigo-500 hover:bg-indigo-600 active:bg-indigo-700 text-white rounded-lg font-medium transition-colors touch-manipulation focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            aria-label="Go to homepage"
          >
            Home
          </button>
          <button
            onClick={onOpenModal}
            className="flex-1 sm:flex-none min-h-[44px] px-4 py-2 bg-purple-500 hover:bg-purple-600 active:bg-purple-700 text-white rounded-lg font-medium transition-colors touch-manipulation focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
            aria-label="How to play"
          >
            How to Play
          </button>
          <button
            onClick={onNewPuzzle}
            className="flex-1 sm:flex-none min-h-[44px] px-4 py-2 bg-gray-200 hover:bg-gray-300 active:bg-gray-400 rounded-lg font-medium transition-colors touch-manipulation focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2"
            aria-label="Generate new puzzle"
          >
            New Puzzle
          </button>
          <button
            onClick={onPrint}
            className="flex-1 sm:flex-none min-h-[44px] px-4 py-2 bg-blue-500 hover:bg-blue-600 active:bg-blue-700 text-white rounded-lg font-medium transition-colors touch-manipulation focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            aria-label="Print puzzle"
          >
            Print
          </button>
          <button
            onClick={onCheckSolution}
            className="flex-1 sm:flex-none min-h-[44px] px-4 py-2 bg-green-500 hover:bg-green-600 active:bg-green-700 text-white rounded-lg font-medium transition-colors touch-manipulation focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
            aria-label="Check solution"
          >
            Check Solution
          </button>
          <button
            onClick={onSolve}
            className="flex-1 sm:flex-none min-h-[44px] px-4 py-2 bg-amber-500 hover:bg-amber-600 active:bg-amber-700 text-white rounded-lg font-medium transition-colors touch-manipulation focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2"
            aria-label="Solve puzzle"
          >
            Solve
          </button>
        </div>
      </div>

      {/* Validation Result */}
      {validationResult && (
        <div
          className={`p-3 sm:p-4 rounded-lg ${
            validationResult.isValid
              ? 'bg-green-100 text-green-800 border border-green-300'
              : 'bg-red-100 text-red-800 border border-red-300'
          }`}
        >
          <p className="font-semibold text-sm sm:text-base">{validationResult.message}</p>
        </div>
      )}

      {/* Invalid Placement Message */}
      {invalidPlacementMessage && (
        <div
          className="p-3 sm:p-4 rounded-lg bg-orange-100 text-orange-800 border border-orange-300 animate-pulse"
          role="alert"
          aria-live="polite"
        >
          <div className="flex items-center justify-between">
            <p className="font-semibold text-sm sm:text-base">{invalidPlacementMessage}</p>
            <button
              onClick={onClearInvalidMessage}
              className="ml-2 text-orange-600 hover:text-orange-800"
              aria-label="Dismiss message"
            >
              ×
            </button>
          </div>
        </div>
      )}

      {/* Placement Mode Indicator */}
      {placementMode !== 'select-domino' && selectedDominoId && (
        <div className="p-2 sm:p-3 rounded-lg bg-blue-50 border border-blue-200">
          <p className="text-xs sm:text-sm text-blue-800 font-medium">
            {placementMode === 'place-first' 
              ? 'Click the first cell to place the domino'
              : 'Click an adjacent cell to complete placement'}
          </p>
        </div>
      )}
    </div>
  );
};

export default TopBar;

