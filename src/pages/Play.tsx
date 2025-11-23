import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { usePuzzleStore } from '../store/puzzleStore';
import PuzzleBoard from '../components/PuzzleBoard';
import DominoTray from '../components/DominoTray';
import PlacementUI from '../components/PlacementUI';
import HowToPlayModal from '../components/HowToPlayModal';

const Play = () => {
  const { difficulty, id } = useParams<{ difficulty?: string; id?: string }>();
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { 
    currentPuzzle, 
    generatePuzzle, 
    validateSolution, 
    validationResult,
    invalidPlacementMessage,
    placementMode,
    selectedDominoId,
    clearInvalidPlacementMessage,
  } = usePuzzleStore();

  useEffect(() => {
    if (id) {
      // TODO: Load puzzle by ID (for future phases)
      // For now, if ID is provided but no puzzle, redirect to home
      if (!currentPuzzle || currentPuzzle.id !== id) {
        navigate('/');
      }
    } else if (difficulty) {
      const validDifficulty = ['easy', 'medium', 'hard'].includes(difficulty)
        ? (difficulty as 'easy' | 'medium' | 'hard')
        : 'medium';
      
      if (!currentPuzzle || currentPuzzle.difficulty !== validDifficulty) {
        generatePuzzle(validDifficulty);
      }
    } else {
      // No difficulty or ID, generate medium by default
      if (!currentPuzzle) {
        generatePuzzle('medium');
      }
    }
  }, [difficulty, id, currentPuzzle, generatePuzzle, navigate]);

  const handleCheckSolution = () => {
    validateSolution();
  };

  const handlePrint = () => {
    if (currentPuzzle) {
      navigate(`/puzzle/${currentPuzzle.id}/print?seed=${encodeURIComponent(currentPuzzle.seed)}&difficulty=${currentPuzzle.difficulty}`);
    }
  };

  const handleNewPuzzle = () => {
    const newDifficulty = currentPuzzle?.difficulty || 'medium';
    navigate(`/play/${newDifficulty}`);
    generatePuzzle(newDifficulty);
  };

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  if (!currentPuzzle) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">Loading puzzle...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-2 sm:p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-4 sm:mb-6 flex flex-col gap-3 sm:gap-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">PIPSCAPE</h1>
              <p className="text-sm sm:text-base text-gray-600 capitalize">
                Difficulty: {currentPuzzle.difficulty}
              </p>
            </div>
            <div className="flex flex-wrap gap-2 w-full sm:w-auto">
              <button
                onClick={handleOpenModal}
                className="flex-1 sm:flex-none min-h-[44px] px-4 py-2 bg-purple-500 hover:bg-purple-600 active:bg-purple-700 text-white rounded-lg font-medium transition-colors touch-manipulation focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
                aria-label="How to play"
              >
                How to Play
              </button>
              <button
                onClick={handleNewPuzzle}
                className="flex-1 sm:flex-none min-h-[44px] px-4 py-2 bg-gray-200 hover:bg-gray-300 active:bg-gray-400 rounded-lg font-medium transition-colors touch-manipulation focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2"
                aria-label="Generate new puzzle"
              >
                New Puzzle
              </button>
              <button
                onClick={handlePrint}
                className="flex-1 sm:flex-none min-h-[44px] px-4 py-2 bg-blue-500 hover:bg-blue-600 active:bg-blue-700 text-white rounded-lg font-medium transition-colors touch-manipulation focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                aria-label="Print puzzle"
              >
                Print
              </button>
              <button
                onClick={handleCheckSolution}
                className="flex-1 sm:flex-none min-h-[44px] px-4 py-2 bg-green-500 hover:bg-green-600 active:bg-green-700 text-white rounded-lg font-medium transition-colors touch-manipulation focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
                aria-label="Check solution"
              >
                Check Solution
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
                  onClick={clearInvalidPlacementMessage}
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

        {/* Game Area */}
        <div className="flex flex-col lg:flex-row gap-4 sm:gap-6">
          {/* Puzzle Board */}
          <div className="flex-1 min-w-0">
            <PlacementUI>
              <PuzzleBoard />
            </PlacementUI>
          </div>

          {/* Domino Tray */}
          <div className="w-full lg:w-80 flex-shrink-0">
            <DominoTray />
          </div>
        </div>
      </div>
      <HowToPlayModal isOpen={isModalOpen} onClose={handleCloseModal} />
    </div>
  );
};

export default Play;

