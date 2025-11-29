import { memo } from 'react';

// Simple className utility
const cn = (...classes: (string | boolean | undefined)[]): string => {
  return classes.filter(Boolean).join(' ');
};

interface DominoTileProps {
  left: number;     // 0–6
  right: number;    // 0–6
  selected?: boolean;
  disabled?: boolean;
  variant?: 'tray' | 'board';
  orientation?: 'horizontal' | 'vertical';
  onClick?: () => void;
  className?: string;
}

// Helper function to get pip positions for a 3×3 grid (9 positions: 0-8)
// Grid layout:
// 0 1 2
// 3 4 5
// 6 7 8
function getPipPositions(value: number): number[] {
  switch (value) {
    case 0:
      return [];
    case 1:
      // center
      return [4];
    case 2:
      // opposite corners
      return [0, 8];
    case 3:
      // two opposite corners + center
      return [0, 4, 8];
    case 4:
      // four corners
      return [0, 2, 6, 8];
    case 5:
      // four corners + center
      return [0, 2, 4, 6, 8];
    case 6:
      // two in each row
      return [0, 2, 3, 5, 6, 8];
    default:
      return [];
  }
}

const DominoSide = ({ value }: { value: number }) => {
  const positions = getPipPositions(value);

  return (
    <div className="flex-1 grid grid-rows-3 grid-cols-3 px-1 py-0.5 min-w-0 min-h-0">
      {Array.from({ length: 9 }).map((_, i) => (
        <div key={i} className="flex items-center justify-center min-w-0 min-h-0">
          {positions.includes(i) && (
            <div 
              className="rounded-full flex-shrink-0 relative"
              style={{
                width: 'clamp(0.375rem, 2vw, 0.5rem)',
                height: 'clamp(0.375rem, 2vw, 0.5rem)',
                backgroundColor: 'rgb(15, 23, 42)', // slate-900 with higher contrast
                // Embossed look with shadows
                boxShadow: `
                  inset 0 1px 2px rgba(255, 255, 255, 0.3),
                  inset 0 -1px 2px rgba(0, 0, 0, 0.2),
                  0 1px 2px rgba(0, 0, 0, 0.1)
                `,
              }}
            />
          )}
        </div>
      ))}
    </div>
  );
};

const DominoTile = ({
  left,
  right,
  selected = false,
  disabled = false,
  variant = 'tray',
  orientation = 'horizontal',
  onClick,
  className = '',
}: DominoTileProps) => {
  const baseSizeClasses = variant === 'board'
    ? 'w-full h-full rounded-xl'
    : 'w-16 h-8 sm:w-20 sm:h-10 rounded-xl';  // tray size

  const stateClasses = [
    !disabled && variant === 'tray' && 'cursor-pointer hover:-translate-y-0.5 hover:shadow-md',
    selected && 'ring-2 ring-indigo-500 ring-offset-1 ring-offset-slate-50 scale-[1.04]',
    disabled && variant === 'tray' && 'opacity-40 cursor-default',
    variant === 'tray' && orientation === 'vertical' && 'rotate-90',
  ].filter(Boolean).join(' ');

  const Component = variant === 'board' ? 'div' : 'button';

  // For vertical orientation, stack sides vertically instead of horizontally
  const flexDirection = orientation === 'vertical' ? 'flex-col' : 'flex-row';
  const dividerClass = orientation === 'vertical'
    ? 'pointer-events-none absolute inset-x-1 top-1/2 h-px bg-slate-300/80'
    : 'pointer-events-none absolute inset-y-1 left-1/2 w-px bg-slate-300/80';

  return (
    <Component
      onClick={onClick}
      disabled={disabled}
      className={cn(
        "relative flex items-stretch justify-between overflow-hidden",
        flexDirection,
        baseSizeClasses,
        "bg-gradient-to-b from-slate-50 to-slate-100",
        "border border-slate-300/80",
        // Enhanced shadows: outer shadow + inner shadow for depth
        "shadow-[0_2px_8px_rgba(0,0,0,0.1),inset_0_2px_4px_rgba(0,0,0,0.06)]",
        "transition-all duration-200",
        stateClasses,
        className
      )}
      aria-label={variant === 'tray' ? `domino: ${left === 0 ? 'blank' : left} and ${right === 0 ? 'blank' : right}` : undefined}
      aria-pressed={variant === 'tray' ? selected : undefined}
    >
      {/* Center dividing line */}
      <div className={dividerClass} />
      
      <DominoSide value={left} />
      <DominoSide value={right} />
    </Component>
  );
};

export default memo(DominoTile);

