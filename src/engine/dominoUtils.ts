import type { Domino } from '../types/puzzle';

// Pip position types for rendering
export type PipPosition = 
  | 'top-left' 
  | 'top-center' 
  | 'top-right'
  | 'mid-left'
  | 'center'
  | 'mid-right'
  | 'bottom-left'
  | 'bottom-center'
  | 'bottom-right';

// Get pip positions for a given count (0-6)
export const getPipPositions = (count: number): PipPosition[] => {
  if (count === 0) {
    return [];
  }

  const pipPositions: { [key: number]: PipPosition[] } = {
    1: ['center'],
    2: ['top-left', 'bottom-right'],
    3: ['top-left', 'center', 'bottom-right'],
    4: ['top-left', 'top-right', 'bottom-left', 'bottom-right'],
    5: ['top-left', 'top-right', 'center', 'bottom-left', 'bottom-right'],
    6: ['top-left', 'top-right', 'mid-left', 'mid-right', 'bottom-left', 'bottom-right'],
  };

  return pipPositions[count] || [];
};

// Get domino value (sum of pips)
export const getDominoValue = (domino: Domino): number => {
  return domino.left + domino.right;
};

// Check if two dominoes are the same (ignoring order)
export const areDominoesEqual = (d1: Domino, d2: Domino): boolean => {
  return (d1.left === d2.left && d1.right === d2.right) ||
         (d1.left === d2.right && d1.right === d2.left);
};

// Find domino by ID
export const findDominoById = (dominoId: string, dominoes: Domino[]): Domino | undefined => {
  return dominoes.find(d => d.id === dominoId);
};

// Get domino for a placement
export const getDominoForPlacement = (placementDominoId: string, dominoes: Domino[]): Domino | undefined => {
  return findDominoById(placementDominoId, dominoes);
};

/**
 * Check if the given domino is a "double", such as 6-6.
 * A double has the same pip count on both sides.
 * 
 * Aligned with brianberns/Pips:
 * let isDouble domino =
 *   domino.Left = domino.Right
 * 
 * @param domino - The domino to check
 * @returns true if the domino is a double
 */
export const isDouble = (domino: Domino): boolean => {
  return domino.left === domino.right;
};

/**
 * Get pip count for a specific side of a domino.
 * 
 * @param domino - The domino
 * @param side - 'left' or 'right'
 * @returns The pip count for that side (0-6)
 */
export const getPipCount = (domino: Domino, side: 'left' | 'right'): number => {
  return side === 'left' ? domino.left : domino.right;
};

