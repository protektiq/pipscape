import { usePuzzleStore } from '../store/puzzleStore';

const DominoTray = () => {
  const {
    currentPuzzle,
    selectedDominoId,
    selectDomino,
    clearSelection,
  } = usePuzzleStore();

  if (!currentPuzzle) {
    return null;
  }

  // Check if domino is placed
  const isDominoPlaced = (dominoId: string) => {
    return currentPuzzle.placements.some(p => p.dominoId === dominoId);
  };

  // Render pips for a number (0-6)
  const renderPips = (count: number, size: 'small' | 'large' = 'large') => {
    if (count === 0) {
      return (
        <div className={`w-full h-full flex items-center justify-center text-gray-400 ${size === 'small' ? 'text-xs' : 'text-sm'}`}>
          0
        </div>
      );
    }

    const pipPositions: { [key: number]: string[] } = {
      1: ['center'],
      2: ['top-left', 'bottom-right'],
      3: ['top-left', 'center', 'bottom-right'],
      4: ['top-left', 'top-right', 'bottom-left', 'bottom-right'],
      5: ['top-left', 'top-right', 'center', 'bottom-left', 'bottom-right'],
      6: ['top-left', 'top-right', 'mid-left', 'mid-right', 'bottom-left', 'bottom-right'],
    };

    const positions = pipPositions[count] || [];
    const gridSize = size === 'small' ? 'grid-cols-2' : 'grid-cols-3';
    const pipSize = size === 'small' ? 'w-1 h-1' : 'w-1.5 h-1.5';

    return (
      <div className={`grid ${gridSize} gap-0.5 p-1 w-full h-full`}>
        {Array.from({ length: size === 'small' ? 4 : 9 }).map((_, i) => {
          if (size === 'small') {
            const row = Math.floor(i / 2);
            const col = i % 2;
            let position = '';
            
            if (row === 0 && col === 0) position = 'top-left';
            else if (row === 0 && col === 1) position = 'top-right';
            else if (row === 1 && col === 0) position = 'bottom-left';
            else if (row === 1 && col === 1) position = 'bottom-right';

            const shouldShowPip = positions.includes(position);

            return (
              <div
                key={i}
                className={`${pipSize} ${
                  shouldShowPip ? 'bg-gray-900 rounded-full' : ''
                }`}
              />
            );
          } else {
            const row = Math.floor(i / 3);
            const col = i % 3;
            let position = '';
            
            if (row === 0 && col === 0) position = 'top-left';
            else if (row === 0 && col === 1) position = 'top-center';
            else if (row === 0 && col === 2) position = 'top-right';
            else if (row === 1 && col === 0) position = 'mid-left';
            else if (row === 1 && col === 1) position = 'center';
            else if (row === 1 && col === 2) position = 'mid-right';
            else if (row === 2 && col === 0) position = 'bottom-left';
            else if (row === 2 && col === 1) position = 'bottom-center';
            else if (row === 2 && col === 2) position = 'bottom-right';

            const shouldShowPip = positions.includes(position);

            return (
              <div
                key={i}
                className={`${pipSize} ${
                  shouldShowPip ? 'bg-gray-900 rounded-full' : ''
                }`}
              />
            );
          }
        })}
      </div>
    );
  };

  const handleDominoClick = (dominoId: string) => {
    if (isDominoPlaced(dominoId)) {
      return; // Don't allow selecting placed dominoes
    }

    if (selectedDominoId === dominoId) {
      clearSelection();
    } else {
      selectDomino(dominoId);
    }
  };

  // Group dominoes by sum for better organization
  const groupedDominoes = currentPuzzle.availableDominoes.reduce((acc, domino) => {
    const sum = domino.left + domino.right;
    if (!acc[sum]) {
      acc[sum] = [];
    }
    acc[sum].push(domino);
    return acc;
  }, {} as { [key: number]: typeof currentPuzzle.availableDominoes });

  return (
    <div className="bg-white rounded-lg shadow-lg p-3 sm:p-4">
      <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-3 sm:mb-4">
        Available Dominoes
      </h2>
      
      <div className="space-y-3 sm:space-y-4 max-h-[calc(100vh-300px)] sm:max-h-[calc(100vh-200px)] overflow-y-auto overscroll-contain">
        {Object.keys(groupedDominoes)
          .sort((a, b) => Number(a) - Number(b))
          .map(sum => (
            <div key={sum} className="mb-3 sm:mb-4">
              <div className="text-xs sm:text-sm font-medium text-gray-600 mb-2">
                Sum: {sum}
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {groupedDominoes[Number(sum)].map(domino => {
                  const isSelected = selectedDominoId === domino.id;
                  const isPlaced = isDominoPlaced(domino.id);

                  return (
                    <button
                      key={domino.id}
                      onClick={() => handleDominoClick(domino.id)}
                      disabled={isPlaced}
                      className={`
                        aspect-[2/1] border-2 rounded-lg p-1.5 sm:p-2
                        flex items-center justify-center gap-1
                        transition-all touch-manipulation
                        min-h-[44px]
                        ${
                          isSelected
                            ? 'border-blue-500 bg-blue-100 ring-2 ring-blue-300 active:bg-blue-200'
                            : isPlaced
                            ? 'border-gray-300 bg-gray-100 opacity-50 cursor-not-allowed'
                            : 'border-gray-300 bg-white hover:border-gray-400 hover:shadow-md active:bg-gray-50 cursor-pointer'
                        }
                      `}
                      aria-label={`Domino ${domino.left}-${domino.right}${isPlaced ? ' (placed)' : ''}${isSelected ? ' (selected)' : ''}`}
                      aria-pressed={isSelected}
                    >
                      <div className="flex-1 h-full flex items-center justify-center border-r border-gray-300">
                        {renderPips(domino.left, 'small')}
                      </div>
                      <div className="flex-1 h-full flex items-center justify-center">
                        {renderPips(domino.right, 'small')}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
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



