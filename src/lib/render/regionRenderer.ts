// Region rendering utilities

import type { Region, Puzzle } from '../../types/puzzle';
import type { RegionColor } from '../../templates/types';
import { getTemplateById } from '../../templates/loader';
import { getRegionColor } from '../../engine/regionUtils';

/**
 * Get color for a region (from template or fallback)
 */
export function getRegionColorForRender(puzzle: Puzzle, regionId: string): RegionColor {
  if (puzzle.shapeTemplate) {
    const template = getTemplateById(puzzle.shapeTemplate.id);
    if (template?.regionColors?.[regionId]) {
      return template.regionColors[regionId];
    }
  }
  
  // Fallback to old color system
  const fallbackColor = getRegionColor(regionId);
  return {
    name: fallbackColor.name,
    bg: fallbackColor.bg,
    border: fallbackColor.border,
    glow: `rgba(${fallbackColor.bg.match(/\d+/g)?.join(', ')}, 0.4)`,
  } as RegionColor;
}

/**
 * Calculate region bounds for rendering
 */
export function getRegionBounds(region: Region): { minRow: number; maxRow: number; minCol: number; maxCol: number } | null {
  if (!region || region.cells.length === 0) return null;
  
  let minRow = region.cells[0].row;
  let maxRow = region.cells[0].row;
  let minCol = region.cells[0].col;
  let maxCol = region.cells[0].col;
  
  region.cells.forEach(cell => {
    minRow = Math.min(minRow, cell.row);
    maxRow = Math.max(maxRow, cell.row);
    minCol = Math.min(minCol, cell.col);
    maxCol = Math.max(maxCol, cell.col);
  });
  
  return { minRow, maxRow, minCol, maxCol };
}

