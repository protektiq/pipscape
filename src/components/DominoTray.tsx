import { memo, useMemo, useCallback } from 'react';
import { usePuzzleData, usePlacementUI, usePuzzleActions } from '../store/puzzleStore';
import type { Domino } from '../types/puzzle';
import DominoTile from './DominoTile';
import DraggableDomino from './DraggableDomino';

const DominoTray = () => {
  const { currentPuzzle } = usePuzzleData();
  const { selectedDominoId, selectedOrientation } = usePlacementUI();
  const { selectDomino, rotateSelectedDomino } = usePuzzleActions();

  // Memoize placed dominoes lookup for O(1) checks
  const placedDominoes = useMemo(() => {
    if (!currentPuzzle) return new Set<string>();
    const placed = new Set<string>();
    for (const placement of currentPuzzle.placements) {
      placed.add(placement.dominoId);
    }
    return placed;
  }, [currentPuzzle?.placements]);

  // Check if domino is placed - memoized
  const isPlaced = useCallback((dominoId: string): boolean => {
    return placedDominoes.has(dominoId);
  }, [placedDominoes]);

  const handleDominoClick = useCallback((dominoId: string) => {
    if (placedDominoes.has(dominoId)) {
      return; // Don't allow selecting placed dominoes
    }

    if (selectedDominoId === dominoId) {
      // Same domino clicked - rotate orientation
      rotateSelectedDomino();
    } else {
      // Different domino clicked - select it (resets orientation to horizontal)
      selectDomino(dominoId);
    }
  }, [placedDominoes, selectedDominoId, rotateSelectedDomino, selectDomino]);

  // Memoize grouped and sorted dominoes - only recalculate when availableDominoes changes
  const { groupedBySum, sortedSums } = useMemo(() => {
    if (!currentPuzzle) {
      return { groupedBySum: {} as Record<number, Domino[]>, sortedSums: [] as number[] };
    }

    // Group dominoes by sum
    const grouped = currentPuzzle.availableDominoes.reduce((acc, domino) => {
      const sum = domino.left + domino.right;
      if (!acc[sum]) {
        acc[sum] = [];
      }
      acc[sum].push(domino);
      return acc;
    }, {} as Record<number, typeof currentPuzzle.availableDominoes>);

    // Sort each group by left value, and sort sums
    const sorted = Object.keys(grouped)
      .map(Number)
      .sort((a, b) => a - b);

    sorted.forEach(sum => {
      grouped[sum].sort((a, b) => {
        if (a.left !== b.left) return a.left - b.left;
        return a.right - b.right;
      });
    });

    return { groupedBySum: grouped, sortedSums: sorted };
  }, [currentPuzzle?.availableDominoes]);

  if (!currentPuzzle) {
    return null;
  }

  return (
    <div className="bg-white rounded-lg shadow-lg p-3 sm:p-4">
      <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-3 sm:mb-4">
        Available Dominoes
      </h2>
      
      <div className="mt-2 flex flex-wrap items-center gap-2">
        {sortedSums.map(sum => {
          const group = groupedBySum[sum];
          return group.map((domino: Domino) => {
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

export default memo(DominoTray);
