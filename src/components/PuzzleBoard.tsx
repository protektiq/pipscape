import { usePuzzleStore } from '../store/puzzleStore';
import { getPlacementForCell } from '../engine/placementUtils';
import Board from './Board';

const PuzzleBoard = () => {
  const {
    currentPuzzle,
    placementMode,
    firstCell,
    validationResult,
    placeDomino,
    rotatePlacement,
    movePlacement,
  } = usePuzzleStore();

  if (!currentPuzzle) {
    return null;
  }

  const handleCellClick = (row: number, col: number) => {
    const placement = getPlacementForCell(row, col, currentPuzzle.placements);
    
    if (placement && placementMode === 'select-domino') {
      // Rotate placement on click when in select-domino mode
      rotatePlacement(row, col);
    } else if (placementMode !== 'select-domino') {
      // Place domino when in placement mode
      placeDomino({ row, col });
    }
  };

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
