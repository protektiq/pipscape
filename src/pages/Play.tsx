import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { DndContext, type DragEndEvent } from '@dnd-kit/core';
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
    createPlacementFromTray,
    movePlacement,
    solvePuzzle,
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

  const handleSolve = () => {
    if (!currentPuzzle?.solution) {
      return;
    }
    console.log('Solve placements', currentPuzzle.solution);
    solvePuzzle();
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

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    
    if (!over) {
      return;
    }

    const overId = over.id as string;
    
    // Check if dropped on a cell
    if (!overId.startsWith('cell-')) {
      return;
    }

    // Parse cell coordinates
    const parts = overId.split('-');
    if (parts.length !== 3) {
      return;
    }

    const row = parseInt(parts[1], 10);
    const col = parseInt(parts[2], 10);

    if (isNaN(row) || isNaN(col)) {
      return;
    }

    // Get drag source data
    const data = active.data.current as { type: 'tray'; dominoId: string } | { type: 'board'; placementId: string } | undefined;

    if (!data) {
      return;
    }

    if (data.type === 'tray') {
      // Create new placement from tray domino
      createPlacementFromTray(data.dominoId, { row, col });
    } else if (data.type === 'board') {
      // Move existing placement
      // We need to find the placement's current position
      if (!currentPuzzle) {
        return;
      }

      const placement = currentPuzzle.placements.find(p => p.dominoId === data.placementId);
      if (!placement) {
        return;
      }

      movePlacement(placement.row, placement.col, row, col);
    }
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
          onSolve={handleSolve}
          onClearInvalidMessage={clearInvalidPlacementMessage}
        />

        {/* Game Area */}
        <DndContext onDragEnd={handleDragEnd}>
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
        </DndContext>
      </div>
      <HowToPlayModal isOpen={isModalOpen} onClose={handleCloseModal} />
    </div>
  );
};

export default Play;
