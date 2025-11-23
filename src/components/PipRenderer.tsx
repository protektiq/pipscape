import { getPipPositions, type PipPosition } from '../engine/dominoUtils';

interface PipRendererProps {
  count: number;
  size?: 'small' | 'large';
}

const PipRenderer = ({ count, size = 'large' }: PipRendererProps) => {
  if (count === 0) {
    return (
      <div className={`w-full h-full flex items-center justify-center text-gray-400 ${size === 'small' ? 'text-xs' : 'text-sm'}`}>
        0
      </div>
    );
  }

  const positions = getPipPositions(count);
  const gridSize = size === 'small' ? 'grid-cols-3' : 'grid-cols-3';
  const totalCells = size === 'small' ? 9 : 9;

  const getPositionForIndex = (i: number): PipPosition | '' => {
    // Always use 3x3 grid for proper pip positioning
    const row = Math.floor(i / 3);
    const col = i % 3;
    
    if (row === 0 && col === 0) return 'top-left';
    if (row === 0 && col === 1) return 'top-center';
    if (row === 0 && col === 2) return 'top-right';
    if (row === 1 && col === 0) return 'mid-left';
    if (row === 1 && col === 1) return 'center';
    if (row === 1 && col === 2) return 'mid-right';
    if (row === 2 && col === 0) return 'bottom-left';
    if (row === 2 && col === 1) return 'bottom-center';
    if (row === 2 && col === 2) return 'bottom-right';
    return '';
  };

  return (
    <div 
      className={`grid ${gridSize} items-center justify-center`}
      style={{
        gap: size === 'small' ? '6px' : '4px',
        padding: '4px',
        width: '100%',
        height: '100%',
        maxWidth: '100%',
        maxHeight: '100%',
        boxSizing: 'border-box',
      }}
    >
      {Array.from({ length: totalCells }).map((_, i) => {
        const position = getPositionForIndex(i);
        const shouldShowPip = position !== '' && positions.includes(position as PipPosition);

        return (
          <div
            key={i}
            className={`flex items-center justify-center ${
              shouldShowPip ? 'bg-black rounded-full shadow-sm' : 'bg-transparent'
            }`}
            style={shouldShowPip ? {
              width: size === 'small' ? '10px' : '6px',
              height: size === 'small' ? '10px' : '6px',
              minWidth: size === 'small' ? '10px' : '6px',
              minHeight: size === 'small' ? '10px' : '6px',
            } : {
              width: size === 'small' ? '10px' : '6px',
              height: size === 'small' ? '10px' : '6px',
            }}
          />
        );
      })}
    </div>
  );
};

export default PipRenderer;

