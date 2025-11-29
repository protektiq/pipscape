// Tests for domino rendering

import { describe, it, expect } from 'vitest';
import { getDominoAreaStyles, getDominoDisplayInfo } from '../dominoRenderer';
import { generatePuzzle } from '../../../engine/generator';
import type { Placement } from '../../../types/puzzle';

describe('Domino Renderer', () => {
  it('should calculate domino area styles for horizontal placement', () => {
    const puzzle = generatePuzzle('easy', 'test-domino-render');
    const solved = gameController.solve(puzzle);
    
    const horizontalPlacement = solved.placements.find(p => p.orientation === 'horizontal');
    if (horizontalPlacement) {
      const bounds = { minRow: 0, minCol: 0 };
      const styles = getDominoAreaStyles(horizontalPlacement, 60, bounds);
      
      expect(styles.width).toBe('120px'); // 2 * cellSize
      expect(styles.height).toBe('60px'); // cellSize
    }
  });

  it('should calculate domino area styles for vertical placement', () => {
    const puzzle = generatePuzzle('easy', 'test-domino-render-2');
    const solved = gameController.solve(puzzle);
    
    const verticalPlacement = solved.placements.find(p => p.orientation === 'vertical');
    if (verticalPlacement) {
      const bounds = { minRow: 0, minCol: 0 };
      const styles = getDominoAreaStyles(verticalPlacement, 60, bounds);
      
      expect(styles.width).toBe('60px'); // cellSize
      expect(styles.height).toBe('120px'); // 2 * cellSize
    }
  });

  it('should get domino display info', () => {
    const info1 = getDominoDisplayInfo({ id: 'test', left: 0, right: 6 });
    expect(info1.leftLabel).toBe('blank');
    expect(info1.rightLabel).toBe('6');
    
    const info2 = getDominoDisplayInfo({ id: 'test', left: 3, right: 3 });
    expect(info2.leftLabel).toBe('3');
    expect(info2.rightLabel).toBe('3');
  });
});

// Import gameController for tests
import { gameController } from '../../game/GameController';

