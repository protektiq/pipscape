import type { Region, Cell, Puzzle } from '../types/puzzle';
import { buildCellLookup } from '../types/puzzle';

// Region color palette with RGB values
export const REGION_COLORS = [
  { name: 'blue', bg: 'rgb(59, 130, 246)', border: 'rgb(37, 99, 235)' },      // blue-500, blue-600
  { name: 'green', bg: 'rgb(34, 197, 94)', border: 'rgb(22, 163, 74)' },     // green-500, green-600
  { name: 'purple', bg: 'rgb(168, 85, 247)', border: 'rgb(147, 51, 234)' }, // purple-500, purple-600
  { name: 'orange', bg: 'rgb(249, 115, 22)', border: 'rgb(234, 88, 12)' },  // orange-500, orange-600
  { name: 'pink', bg: 'rgb(236, 72, 153)', border: 'rgb(219, 39, 119)' },   // pink-500, pink-600
  { name: 'teal', bg: 'rgb(20, 184, 166)', border: 'rgb(15, 118, 110)' },    // teal-500, teal-600
  { name: 'amber', bg: 'rgb(245, 158, 11)', border: 'rgb(217, 119, 6)' },   // amber-500, amber-600
  { name: 'indigo', bg: 'rgb(99, 102, 241)', border: 'rgb(79, 70, 229)' },  // indigo-500, indigo-600
  { name: 'rose', bg: 'rgb(244, 63, 94)', border: 'rgb(225, 29, 72)' },      // rose-500, rose-600
  { name: 'cyan', bg: 'rgb(6, 182, 212)', border: 'rgb(8, 145, 178)' },      // cyan-500, cyan-600
];

export type RegionColor = typeof REGION_COLORS[number];

// Generate consistent color from region ID
export const getRegionColor = (regionId: string): RegionColor => {
  // Simple hash function to get consistent color index
  let hash = 0;
  for (let i = 0; i < regionId.length; i++) {
    hash = ((hash << 5) - hash) + regionId.charCodeAt(i);
    hash = hash & hash; // Convert to 32-bit integer
  }
  const index = Math.abs(hash) % REGION_COLORS.length;
  return REGION_COLORS[index];
};

// Edge information for a cell
export type EdgeInfo = {
  top: boolean;
  right: boolean;
  bottom: boolean;
  left: boolean;
};

// Check if a cell is in a region
export const isCellInRegion = (row: number, col: number, regionId: string, regions: Region[]): boolean => {
  const region = regions.find(r => r.id === regionId);
  if (!region) return false;
  return region.cells.some(cell => cell.row === row && cell.col === col);
};

// Get boundary edge information for a cell (works with sparse grids)
export const getRegionEdgeInfo = (
  row: number, 
  col: number, 
  regionId: string,
  regions: Region[],
  puzzle: Puzzle
): EdgeInfo => {
  const cellMap = buildCellLookup(puzzle);
  
  // Check if neighbor exists and is in the same region
  const top = row === 0 || 
              !cellMap.has(`${row - 1}-${col}`) || 
              !isCellInRegion(row - 1, col, regionId, regions);
  const right = col === puzzle.cols - 1 || 
                !cellMap.has(`${row}-${col + 1}`) || 
                !isCellInRegion(row, col + 1, regionId, regions);
  const bottom = row === puzzle.rows - 1 || 
                 !cellMap.has(`${row + 1}-${col}`) || 
                 !isCellInRegion(row + 1, col, regionId, regions);
  const left = col === 0 || 
               !cellMap.has(`${row}-${col - 1}`) || 
               !isCellInRegion(row, col - 1, regionId, regions);
  
  return { top, right, bottom, left };
};

// Check if a corner is an outer corner (convex corner) - works with sparse grids
export const isOuterCorner = (
  row: number,
  col: number,
  regionId: string,
  regions: Region[],
  corner: 'tl' | 'tr' | 'bl' | 'br',
  puzzle: Puzzle
): boolean => {
  const edgeInfo = getRegionEdgeInfo(row, col, regionId, regions, puzzle);
  const cellMap = buildCellLookup(puzzle);
  
  if (corner === 'tl') {
    // Top-left corner: both top and left edges are boundaries
    // And diagonal cell (top-left) is not in region or doesn't exist
    return edgeInfo.top && edgeInfo.left && 
           (!cellMap.has(`${row - 1}-${col - 1}`) || 
            !isCellInRegion(row - 1, col - 1, regionId, regions));
  } else if (corner === 'tr') {
    // Top-right corner: both top and right edges are boundaries
    return edgeInfo.top && edgeInfo.right &&
           (!cellMap.has(`${row - 1}-${col + 1}`) || 
            !isCellInRegion(row - 1, col + 1, regionId, regions));
  } else if (corner === 'bl') {
    // Bottom-left corner: both bottom and left edges are boundaries
    return edgeInfo.bottom && edgeInfo.left &&
           (!cellMap.has(`${row + 1}-${col - 1}`) || 
            !isCellInRegion(row + 1, col - 1, regionId, regions));
  } else if (corner === 'br') {
    // Bottom-right corner: both bottom and right edges are boundaries
    return edgeInfo.bottom && edgeInfo.right &&
           (!cellMap.has(`${row + 1}-${col + 1}`) || 
            !isCellInRegion(row + 1, col + 1, regionId, regions));
  }
  
  return false;
};

// Calculate region bounds for badge positioning
export const getRegionBounds = (region: Region): { minRow: number; maxRow: number; minCol: number; maxCol: number } | null => {
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
};

// Get the bottom-left cell of a region (for badge positioning)
export const getBottomLeftCell = (region: Region): Cell | null => {
  if (!region || region.cells.length === 0) return null;
  
  return region.cells.reduce((bottomLeft, cell) => {
    // Prefer cell with higher row (bottom), then lower column (left)
    if (!bottomLeft) return cell;
    if (cell.row > bottomLeft.row) return cell;
    if (cell.row === bottomLeft.row && cell.col < bottomLeft.col) return cell;
    return bottomLeft;
  }, region.cells[0] || null);
};

// Get region for a cell
export const getRegionForCell = (row: number, col: number, regions: Region[]): Region | undefined => {
  return regions.find(region =>
    region.cells.some(cell => cell.row === row && cell.col === col)
  );
};

