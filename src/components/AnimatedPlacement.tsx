import { memo, useEffect, useState } from 'react';
import type { Placement, Domino } from '../types/puzzle';
import DominoTile from './DominoTile';
import { getTransitionStyle, DEFAULT_ANIMATION_CONFIG } from '../lib/animations/solveAnimation';

interface AnimatedPlacementProps {
  placement: Placement;
  domino: Domino;
  cellSize: number;
  bounds: { minRow: number; minCol: number };
  animationDelay: number;
  onAnimationComplete?: () => void;
}

const AnimatedPlacement = ({
  placement,
  domino,
  cellSize,
  bounds,
  animationDelay,
  onAnimationComplete,
}: AnimatedPlacementProps) => {
  const [isAnimating, setIsAnimating] = useState(true);
  const { row, col, orientation } = placement;
  
  // Calculate target position coordinates
  const relativeRow = row - bounds.minRow;
  const relativeCol = col - bounds.minCol;
  const targetLeft = relativeCol * cellSize;
  const targetTop = relativeRow * cellSize;
  
  // Initialize to off-screen position, then animate to target
  const [targetPosition, setTargetPosition] = useState({ top: -100, left: -100 });
  
  // Animate to target position after a brief delay
  useEffect(() => {
    const timeout = setTimeout(() => {
      setTargetPosition({ top: targetTop, left: targetLeft });
    }, animationDelay);
    
    return () => clearTimeout(timeout);
  }, [targetTop, targetLeft, animationDelay]);
  
  // Notify when animation completes
  useEffect(() => {
    if (!isAnimating) return;
    
    const timeout = setTimeout(() => {
      setIsAnimating(false);
      onAnimationComplete?.();
    }, animationDelay + DEFAULT_ANIMATION_CONFIG.duration);
    
    return () => clearTimeout(timeout);
  }, [isAnimating, animationDelay, onAnimationComplete]);
  
  const areaStyles: React.CSSProperties = {
    position: 'absolute',
    left: `${targetPosition.left}px`,
    top: `${targetPosition.top}px`,
    width: orientation === 'horizontal' ? `${cellSize * 2}px` : `${cellSize}px`,
    height: orientation === 'horizontal' ? `${cellSize}px` : `${cellSize * 2}px`,
    ...getTransitionStyle(animationDelay),
  };

  return (
    <div style={areaStyles} className="flex items-center justify-center p-1 sm:p-1.5 pointer-events-auto z-20">
      <DominoTile
        left={domino.left}
        right={domino.right}
        variant="board"
        orientation={orientation}
      />
    </div>
  );
};

export default memo(AnimatedPlacement);

