import { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { usePuzzleStore } from '../store/puzzleStore';
import PuzzleBoard from '../components/PuzzleBoard';
import DominoTray from '../components/DominoTray';
import PlacementUI from '../components/PlacementUI';

const Play = () => {
  const { difficulty, id } = useParams<{ difficulty?: string; id?: string }>();
  const navigate = useNavigate();
  const { currentPuzzle, generatePuzzle, validateSolution, validationResult } = usePuzzleStore();

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
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6 flex flex-col sm:flex-row justify-between items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">PIPSCAPE</h1>
            <p className="text-gray-600 capitalize">
              Difficulty: {currentPuzzle.difficulty}
            </p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={handleNewPuzzle}
              className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-lg font-medium transition-colors"
            >
              New Puzzle
            </button>
            <button
              onClick={handlePrint}
              className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-medium transition-colors"
            >
              Print
            </button>
            <button
              onClick={handleCheckSolution}
              className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg font-medium transition-colors"
            >
              Check Solution
            </button>
          </div>
        </div>

        {/* Validation Result */}
        {validationResult && (
          <div
            className={`mb-4 p-4 rounded-lg ${
              validationResult.isValid
                ? 'bg-green-100 text-green-800 border border-green-300'
                : 'bg-red-100 text-red-800 border border-red-300'
            }`}
          >
            <p className="font-semibold">{validationResult.message}</p>
          </div>
        )}

        {/* Game Area */}
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Puzzle Board */}
          <div className="flex-1">
            <PlacementUI>
              <PuzzleBoard />
            </PlacementUI>
          </div>

          {/* Domino Tray */}
          <div className="lg:w-80">
            <DominoTray />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Play;

