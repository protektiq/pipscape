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
      <div className="frosted-glass rounded-2xl shadow-card p-4 sm:p-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">PIPSCAPE</h1>
          <p className="text-sm sm:text-base text-gray-600 capitalize">
            Difficulty: {puzzle.difficulty}
          </p>
        </div>
        <div className="flex flex-wrap gap-2 w-full sm:w-auto">
          <button
            onClick={onGoHome}
            className="flex-1 sm:flex-none min-h-[44px] px-4 py-2 rounded-xl font-medium transition-all duration-200 touch-manipulation focus:outline-none focus:ring-2 focus:ring-offset-2 shadow-sm hover:shadow-md text-white"
            style={{
              backgroundColor: 'rgb(145, 145, 205)', // periwinkle
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = 'rgb(165, 165, 225)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'rgb(145, 145, 205)';
            }}
            aria-label="Go to homepage"
          >
            Home
          </button>
          <button
            onClick={onOpenModal}
            className="flex-1 sm:flex-none min-h-[44px] px-4 py-2 rounded-xl font-medium transition-all duration-200 touch-manipulation focus:outline-none focus:ring-2 focus:ring-offset-2 shadow-sm hover:shadow-md text-white"
            style={{
              backgroundColor: 'rgb(170, 135, 205)', // lilac
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = 'rgb(190, 155, 225)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'rgb(170, 135, 205)';
            }}
            aria-label="How to play"
          >
            How to Play
          </button>
          <button
            onClick={onNewPuzzle}
            className="flex-1 sm:flex-none min-h-[44px] px-4 py-2 rounded-xl font-medium transition-all duration-200 touch-manipulation focus:outline-none focus:ring-2 focus:ring-offset-2 shadow-sm hover:shadow-md text-white"
            style={{
              backgroundColor: 'rgb(125, 155, 125)', // sage
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = 'rgb(145, 175, 145)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'rgb(125, 155, 125)';
            }}
            aria-label="Generate new puzzle"
          >
            New Puzzle
          </button>
          <button
            onClick={onPrint}
            className="flex-1 sm:flex-none min-h-[44px] px-4 py-2 rounded-xl font-medium transition-all duration-200 touch-manipulation focus:outline-none focus:ring-2 focus:ring-offset-2 shadow-sm hover:shadow-md text-white"
            style={{
              backgroundColor: 'rgb(110, 160, 180)', // sky
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = 'rgb(130, 180, 200)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'rgb(110, 160, 180)';
            }}
            aria-label="Print puzzle"
          >
            Print
          </button>
          <button
            onClick={onCheckSolution}
            className="flex-1 sm:flex-none min-h-[44px] px-4 py-2 rounded-xl font-medium transition-all duration-200 touch-manipulation focus:outline-none focus:ring-2 focus:ring-offset-2 shadow-sm hover:shadow-md text-white"
            style={{
              backgroundColor: 'rgb(100, 170, 185)', // mint
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = 'rgb(120, 190, 205)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'rgb(100, 170, 185)';
            }}
            aria-label="Check solution"
          >
            Check Solution
          </button>
          <button
            onClick={onSolve}
            className="flex-1 sm:flex-none min-h-[44px] px-4 py-2 rounded-xl font-medium transition-all duration-200 touch-manipulation focus:outline-none focus:ring-2 focus:ring-offset-2 shadow-sm hover:shadow-md text-white"
            style={{
              backgroundColor: 'rgb(240, 160, 60)', // amber
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = 'rgb(255, 180, 80)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'rgb(240, 160, 60)';
            }}
            aria-label="Solve puzzle"
          >
            Solve
          </button>
        </div>
      </div>

      {/* Validation Result */}
      {validationResult && (
        <div
          className="frosted-glass p-3 sm:p-4 rounded-xl shadow-card"
          style={{
            backgroundColor: validationResult.isValid 
              ? 'rgba(125, 155, 125, 0.6)' // sage
              : 'rgba(255, 130, 150, 0.6)', // rose
            color: validationResult.isValid
              ? 'rgb(60, 100, 60)'
              : 'rgb(180, 80, 100)',
            border: `1px solid ${validationResult.isValid 
              ? 'rgba(90, 130, 90, 0.5)' 
              : 'rgba(255, 100, 130, 0.5)'}`,
          }}
        >
          <p className="font-semibold text-sm sm:text-base">{validationResult.message}</p>
        </div>
      )}

      {/* Invalid Placement Message */}
      {invalidPlacementMessage && (
        <div
          className="frosted-glass p-3 sm:p-4 rounded-xl shadow-card animate-pulse"
          style={{
            backgroundColor: 'rgba(255, 160, 120, 0.6)', // peach
            color: 'rgb(180, 100, 60)',
            border: '1px solid rgba(255, 125, 80, 0.5)',
          }}
          role="alert"
          aria-live="polite"
        >
          <div className="flex items-center justify-between">
            <p className="font-semibold text-sm sm:text-base">{invalidPlacementMessage}</p>
            <button
              onClick={onClearInvalidMessage}
              className="ml-2 transition-colors"
              style={{
                color: 'rgb(180, 100, 60)',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = 'rgb(200, 120, 80)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = 'rgb(180, 100, 60)';
              }}
              aria-label="Dismiss message"
            >
              ×
            </button>
          </div>
        </div>
      )}

      {/* Placement Mode Indicator */}
      {placementMode !== 'select-domino' && selectedDominoId && (
        <div 
          className="frosted-glass p-2 sm:p-3 rounded-xl shadow-card"
          style={{
            backgroundColor: 'rgba(110, 160, 180, 0.6)', // sky
            border: '1px solid rgba(70, 135, 175, 0.5)',
          }}
        >
          <p 
            className="text-xs sm:text-sm font-medium"
            style={{
              color: 'rgb(30, 120, 150)',
            }}
          >
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

