import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { DndContext, type DragEndEvent, PointerSensor, TouchSensor, MouseSensor, useSensors, useSensor } from '@dnd-kit/core';
import { usePuzzleData, usePlacementUI, useValidationState, usePuzzleActions } from '../store/puzzleStore';
import { usePuzzleInitialization } from '../hooks/usePuzzleInitialization';
import PuzzleBoard from '../components/PuzzleBoard';
import DominoTray from '../components/DominoTray';
import PlacementUI from '../components/PlacementUI';
import HowToPlayModal from '../components/HowToPlayModal';
import TopBar from '../components/TopBar';

const Play = () => {
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // Use optimized selectors to prevent unnecessary re-renders
  const { currentPuzzle, isGenerating, generationError } = usePuzzleData();
  const { placementMode, selectedDominoId } = usePlacementUI();
  const { validationResult, invalidPlacementMessage } = useValidationState();
  const {
    generatePuzzle,
    validateSolution,
    clearInvalidPlacementMessage,
    createPlacementFromTray,
    movePlacement,
    solvePuzzle,
    clearGenerationError,
  } = usePuzzleActions();

  // Use custom hook for puzzle initialization
  usePuzzleInitialization({
    currentPuzzle,
    generatePuzzle,
  });

  const handleCheckSolution = useCallback(() => {
    validateSolution();
  }, [validateSolution]);

  const handleSolve = useCallback(() => {
    if (!currentPuzzle) {
      return;
    }
    solvePuzzle();
  }, [currentPuzzle, solvePuzzle]);

  const handlePrint = useCallback(() => {
    if (currentPuzzle) {
      navigate(`/puzzle/${currentPuzzle.id}/print?seed=${encodeURIComponent(currentPuzzle.seed)}&difficulty=${currentPuzzle.difficulty}`);
    }
  }, [currentPuzzle, navigate]);

  const handleNewPuzzle = useCallback(() => {
    const newDifficulty = currentPuzzle?.difficulty || 'medium';
    navigate(`/play/${newDifficulty}`);
    void generatePuzzle(newDifficulty);
  }, [currentPuzzle?.difficulty, navigate, generatePuzzle]);

  const handleOpenModal = useCallback(() => {
    setIsModalOpen(true);
  }, []);

  const handleCloseModal = useCallback(() => {
    setIsModalOpen(false);
  }, []);

  const handleGoHome = useCallback(() => {
    navigate('/');
  }, [navigate]);

  // Configure sensors for drag and drop - must be called at top level, not inside useMemo
  const sensors = useSensors(
    // PointerSensor works for both mouse and touch (recommended)
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5, // Require 5px movement before drag starts (prevents accidental drags)
      },
    }),
    // TouchSensor as explicit touch support
    useSensor(TouchSensor, {
      activationConstraint: {
        delay: 100, // 100ms delay before drag starts
        tolerance: 5, // Allow 5px movement during delay
      },
    }),
    // MouseSensor for desktop mouse support
    useSensor(MouseSensor, {
      activationConstraint: {
        distance: 5, // Require 5px movement before drag starts
      },
    })
  );

  const handleDragEnd = useCallback((event: DragEndEvent) => {
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
  }, [currentPuzzle, createPlacementFromTray, movePlacement]);

  // Show error state if generation failed completely
  if (generationError && !isGenerating) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
        <div className="max-w-md w-full text-center">
          <div className="bg-red-100 border border-red-300 rounded-lg p-6 mb-4">
            <h2 className="text-xl font-semibold text-red-800 mb-2">Generation Failed</h2>
            <p className="text-red-700 mb-4">{generationError}</p>
            <div className="flex gap-3 justify-center">
              <button
                onClick={() => {
                  clearGenerationError();
                  const difficulty = currentPuzzle?.difficulty || 'medium';
                  void generatePuzzle(difficulty);
                }}
                className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-medium transition-colors"
              >
                Try Again
              </button>
              <button
                onClick={() => {
                  clearGenerationError();
                  navigate('/');
                }}
                className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-lg font-medium transition-colors"
              >
                Go Home
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!currentPuzzle || isGenerating) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
        <div className="text-center max-w-md">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
          <p className="text-gray-600 text-lg font-medium">Loading puzzle...</p>
          <p className="text-gray-500 text-sm mt-2">Generating puzzle in background</p>
          <p className="text-gray-400 text-xs mt-4">
            This should only take a moment. If it takes longer, please try again.
          </p>
          <button
            onClick={() => {
              navigate('/');
            }}
            className="mt-6 px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-lg font-medium transition-colors text-sm"
          >
            Cancel
          </button>
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
        <DndContext sensors={sensors} onDragEnd={handleDragEnd}>
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
