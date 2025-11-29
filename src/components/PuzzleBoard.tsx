import { useCallback, useMemo } from 'react';
import { usePuzzleData, usePlacementUI, useValidationState, usePuzzleActions } from '../store/puzzleStore';
import { buildPlacementLookup, getPlacementForCellFromMap } from '../engine/placementUtils';
import Board from './Board';

const PuzzleBoard = () => {
  const { currentPuzzle } = usePuzzleData();
  const { placementMode, firstCell } = usePlacementUI();
  const { validationResult } = useValidationState();
  const { placeDomino, rotatePlacement, movePlacement } = usePuzzleActions();

  // Memoize placement lookup for O(1) access
  const placementLookup = useMemo(() => {
    if (!currentPuzzle) return new Map();
    return buildPlacementLookup(currentPuzzle.placements);
  }, [currentPuzzle?.placements]);

  if (!currentPuzzle) {
    return null;
  }

  const handleCellClick = useCallback((row: number, col: number) => {
    if (!currentPuzzle) return;
    
    const placement = getPlacementForCellFromMap(row, col, placementLookup);
    
    if (placement && placementMode === 'select-domino') {
      // Rotate placement on click when in select-domino mode
      rotatePlacement(row, col);
    } else if (placementMode !== 'select-domino') {
      // Place domino when in placement mode
      placeDomino({ row, col });
    }
  }, [currentPuzzle, placementLookup, placementMode, rotatePlacement, placeDomino]);

  return (
    <Board
      puzzle={currentPuzzle}
      placementMode={placementMode}
      firstCell={firstCell}
      validationResult={validationResult}
      onCellClick={handleCellClick}
      onMovePlacement={movePlacement}
    />
  );
};

export default PuzzleBoard;
