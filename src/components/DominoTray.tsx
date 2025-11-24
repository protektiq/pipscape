import { usePuzzleStore } from '../store/puzzleStore';
import { isDominoPlaced } from '../engine/placementEngine';
import DominoTile from './DominoTile';
import DraggableDomino from './DraggableDomino';

const DominoTray = () => {
  const {
    currentPuzzle,
    selectedDominoId,
    selectedOrientation,
    selectDomino,
    rotateSelectedDomino,
  } = usePuzzleStore();

  if (!currentPuzzle) {
    return null;
  }

  // Check if domino is placed
  const isPlaced = (dominoId: string) => {
    return isDominoPlaced(dominoId, currentPuzzle);
  };

  const handleDominoClick = (dominoId: string) => {
    if (isPlaced(dominoId)) {
      return; // Don't allow selecting placed dominoes
    }

    if (selectedDominoId === dominoId) {
      // Same domino clicked - rotate orientation
      rotateSelectedDomino();
    } else {
      // Different domino clicked - select it (resets orientation to horizontal)
      selectDomino(dominoId);
    }
  };

  // Group dominoes by sum
  const groupedBySum = currentPuzzle.availableDominoes.reduce((acc, domino) => {
    const sum = domino.left + domino.right;
    if (!acc[sum]) {
      acc[sum] = [];
    }
    acc[sum].push(domino);
    return acc;
  }, {} as Record<number, typeof currentPuzzle.availableDominoes>);

  // Sort each group by left value, and sort sums
  const sortedSums = Object.keys(groupedBySum)
    .map(Number)
    .sort((a, b) => a - b);

  sortedSums.forEach(sum => {
    groupedBySum[sum].sort((a, b) => {
      if (a.left !== b.left) return a.left - b.left;
      return a.right - b.right;
    });
  });

  return (
    <div className="bg-white rounded-lg shadow-lg p-3 sm:p-4">
      <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-3 sm:mb-4">
        Available Dominoes
      </h2>
      
      <div className="mt-2 flex flex-wrap items-center gap-2">
        {sortedSums.map(sum => {
          const group = groupedBySum[sum];
          return group.map(domino => {
            const isSelected = selectedDominoId === domino.id;
            const isPlacedDomino = isPlaced(domino.id);

            return (
              <DraggableDomino
                key={domino.id}
                id={domino.id}
                data={{ type: 'tray', dominoId: domino.id }}
                disabled={isPlacedDomino}
              >
                <DominoTile
                  left={domino.left}
                  right={domino.right}
                  selected={isSelected}
                  disabled={isPlacedDomino}
                  orientation={isSelected ? selectedOrientation : 'horizontal'}
                  onClick={() => handleDominoClick(domino.id)}
                />
              </DraggableDomino>
            );
          });
        })}
      </div>

      {selectedDominoId && (
        <div className="mt-3 sm:mt-4 p-2 sm:p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-xs sm:text-sm text-blue-800">
            Selected: Click two adjacent cells to place
          </p>
        </div>
      )}
    </div>
  );
};

export default DominoTray;
