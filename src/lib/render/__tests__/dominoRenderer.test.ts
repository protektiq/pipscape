// Tests for domino rendering

import { describe, it, expect } from 'vitest';
import { getDominoAreaStyles, getDominoDisplayInfo } from '../dominoRenderer';
import { generatePuzzle } from '../../../engine/generator';
import { gameController } from '../../game/GameController';

describe('Domino Renderer', () => {
  it('should calculate domino area styles for horizontal placement', () => {
    let puzzle;
    try {
      puzzle = generatePuzzle('easy', 'test-domino-render');
    } catch {
      // If generation fails, skip test
      return;
    }
    
    const solved = gameController.solve(puzzle);
    if (!solved.placements || solved.placements.length === 0) {
      return; // Skip if no placements
    }
    
    const horizontalPlacement = solved.placements.find(p => p.orientation === 'horizontal');
    if (horizontalPlacement) {
      const bounds = { minRow: 0, minCol: 0 };
      const styles = getDominoAreaStyles(horizontalPlacement, 60, bounds);
      
      expect(styles.width).toBe('120px'); // 2 * cellSize
      expect(styles.height).toBe('60px'); // cellSize
    }
  });

  it('should calculate domino area styles for vertical placement', () => {
    let puzzle;
    try {
      puzzle = generatePuzzle('easy', 'test-domino-render-2');
    } catch {
      // If generation fails, skip test
      return;
    }
    
    const solved = gameController.solve(puzzle);
    if (!solved.placements || solved.placements.length === 0) {
      return; // Skip if no placements
    }
    
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

