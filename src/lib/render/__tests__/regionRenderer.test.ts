// Tests for region rendering

import { describe, it, expect } from 'vitest';
import { getRegionColorForRender, getRegionBounds } from '../regionRenderer';
import { generatePuzzle } from '../../../engine/generator';

describe('Region Renderer', () => {
  it('should get region color for render', () => {
    const puzzle = generatePuzzle('easy', 'test-region-render');
    
    if (puzzle.regions.length > 0) {
      const region = puzzle.regions[0];
      const color = getRegionColorForRender(puzzle, region.id);
      
      expect(color).toBeDefined();
      expect(color.bg).toBeDefined();
      expect(color.border).toBeDefined();
    }
  });

  it('should calculate region bounds', () => {
    const puzzle = generatePuzzle('medium', 'test-bounds');
    
    puzzle.regions.forEach(region => {
      const bounds = getRegionBounds(region);
      
      expect(bounds).toBeDefined();
      if (bounds) {
        expect(bounds.minRow).toBeLessThanOrEqual(bounds.maxRow);
        expect(bounds.minCol).toBeLessThanOrEqual(bounds.maxCol);
      }
    });
  });
});

