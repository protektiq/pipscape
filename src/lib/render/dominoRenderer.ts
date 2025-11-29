// Domino rendering utilities

import type { Domino, Placement } from '../../types/puzzle';

/**
 * Calculate domino area styles for rendering
 */
export function getDominoAreaStyles(
  placement: Placement,
  cellSize: number,
  bounds: { minRow: number; minCol: number }
): React.CSSProperties {
  const { row, col, orientation } = placement;
  const relativeRow = row - bounds.minRow;
  const relativeCol = col - bounds.minCol;
  const left = relativeCol * cellSize;
  const top = relativeRow * cellSize;

  return orientation === 'horizontal'
    ? {
        position: 'absolute' as const,
        left: `${left}px`,
        top: `${top}px`,
        width: `${cellSize * 2}px`,
        height: `${cellSize}px`,
      }
    : {
        position: 'absolute' as const,
        left: `${left}px`,
        top: `${top}px`,
        width: `${cellSize}px`,
        height: `${cellSize * 2}px`,
      };
}

/**
 * Get domino display info
 */
export function getDominoDisplayInfo(domino: Domino): {
  leftLabel: string;
  rightLabel: string;
} {
  return {
    leftLabel: domino.left === 0 ? 'blank' : domino.left.toString(),
    rightLabel: domino.right === 0 ? 'blank' : domino.right.toString(),
  };
}

