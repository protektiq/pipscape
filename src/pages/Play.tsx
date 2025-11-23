import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { usePuzzleStore } from '../store/puzzleStore';
import PuzzleBoard from '../components/PuzzleBoard';
import DominoTray from '../components/DominoTray';
import PlacementUI from '../components/PlacementUI';
import HowToPlayModal from '../components/HowToPlayModal';
import TopBar from '../components/TopBar';

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

  const handleGoHome = () => {
    navigate('/');
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
        <TopBar
          puzzle={currentPuzzle}
          validationResult={validationResult}
          invalidPlacementMessage={invalidPlacementMessage}
          placementMode={placementMode}
          selectedDominoId={selectedDominoId}
          onGoHome={handleGoHome}
          onOpenModal={handleOpenModal}
          onNewPuzzle={handleNewPuzzle}
          onPrint={handlePrint}
          onCheckSolution={handleCheckSolution}
          onClearInvalidMessage={clearInvalidPlacementMessage}
        />

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
