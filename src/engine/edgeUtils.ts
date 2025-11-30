import type { Placement, CellPosition } from '../types/puzzle';
import type { Edge } from '../types/edge';
import { getPlacementCells } from './placementUtils';
import { cellToKey } from './cellUtils';

/**
 * Edge utilities aligned with brianberns/Pips Edge module.
 * Includes conversion functions between Edge and Placement representations.
 */

/**
 * Reverse the given edge direction.
 * (cellA, cellB) -> (cellB, cellA)
 * 
 * Aligned with brianberns/Pips:
 * let reverse ((cellA, cellB) : Edge) : Edge =
 *   cellB, cellA
 */
export const reverseEdge = (edge: Edge): Edge => {
  return [edge[1], edge[0]];
};

/**
 * Normalize an edge by ensuring it's in a consistent order.
 * Uses lexicographic ordering: smaller row first, then smaller col.
 * This ensures edges can be compared regardless of direction.
 */
export const normalizeEdge = (edge: Edge): Edge => {
  const [cell1, cell2] = edge;
  // Lexicographic ordering: row first, then col
  if (cell1.row < cell2.row) {
    return edge;
  }
  if (cell1.row > cell2.row) {
    return reverseEdge(edge);
  }
  // Same row, compare columns
  if (cell1.col <= cell2.col) {
    return edge;
  }
  return reverseEdge(edge);
};

/**
 * Generate a consistent string key for an edge (normalized).
 * Format: "row1-col1:row2-col2" (normalized order)
 * 
 * @param edge - The edge
 * @returns A normalized string key for the edge
 */
export const edgeKey = (edge: Edge): string => {
  const normalized = normalizeEdge(edge);
  const [cell1, cell2] = normalized;
  return `${cell1.row}-${cell1.col}:${cell2.row}-${cell2.col}`;
};

/**
 * Check if two edges are equal (order-independent).
 */
export const edgesEqual = (edge1: Edge, edge2: Edge): boolean => {
  const key1 = edgeKey(edge1);
  const key2 = edgeKey(edge2);
  return key1 === key2;
};

/**
 * Check if two cells are adjacent (horizontally or vertically).
 */
const areCellsAdjacent = (cell1: CellPosition, cell2: CellPosition): boolean => {
  const rowDiff = Math.abs(cell1.row - cell2.row);
  const colDiff = Math.abs(cell1.col - cell2.col);
  return (rowDiff === 1 && colDiff === 0) || (rowDiff === 0 && colDiff === 1);
};

/**
 * Convert a Placement to an Edge.
 * 
 * @param placement - The placement to convert
 * @returns The edge representing this placement
 */
export const placementToEdge = (placement: Placement): Edge => {
  const cells = getPlacementCells(placement);
  if (cells.length !== 2) {
    throw new Error(`Placement must cover exactly 2 cells, got ${cells.length}`);
  }
  
  const [cell1, cell2] = cells;
  
  // Ensure cells are adjacent
  if (!areCellsAdjacent(cell1, cell2)) {
    throw new Error(`Cells in placement are not adjacent: ${cellToKey(cell1)} and ${cellToKey(cell2)}`);
  }
  
  return [cell1, cell2];
};

/**
 * Convert an Edge to a Placement.
 * 
 * @param edge - The edge to convert
 * @param dominoId - The ID of the domino to place
 * @returns A placement representing this edge
 */
export const edgeToPlacement = (edge: Edge, dominoId: string): Placement => {
  const [cell1, cell2] = edge;
  
  // Ensure cells are adjacent
  if (!areCellsAdjacent(cell1, cell2)) {
    throw new Error(`Cells in edge are not adjacent: ${cellToKey(cell1)} and ${cellToKey(cell2)}`);
  }
  
  // Determine orientation
  const isHorizontal = cell1.row === cell2.row;
  const orientation: 'horizontal' | 'vertical' = isHorizontal ? 'horizontal' : 'vertical';
  
  // Use the leftmost/topmost cell as anchor
  const anchorCell = isHorizontal
    ? (cell1.col < cell2.col ? cell1 : cell2)
    : (cell1.row < cell2.row ? cell1 : cell2);
  
  return {
    id: `${dominoId}-${anchorCell.row}-${anchorCell.col}`,
    dominoId,
    row: anchorCell.row,
    col: anchorCell.col,
    orientation,
    fixed: false,
  };
};

/**
 * Convert an array of Placements to an array of Edges.
 * 
 * @param placements - The placements to convert
 * @returns Array of edges
 */
export const placementsToEdges = (placements: Placement[]): Edge[] => {
  return placements.map(placementToEdge);
};

/**
 * Convert an array of Edges back to Placements.
 * 
 * @param _edges - The edges to convert (unused, mappings contain edges)
 * @param dominoMappings - Array of { edge, dominoId } mappings to determine which domino goes where
 * @returns Array of placements
 */
export const edgesToPlacements = (
  _edges: Edge[],
  dominoMappings: Array<{ edge: Edge; dominoId: string }>
): Placement[] => {
  const placements: Placement[] = [];
  
  for (const mapping of dominoMappings) {
    const placement = edgeToPlacement(mapping.edge, mapping.dominoId);
    placements.push(placement);
  }
  
  return placements;
};

/**
 * Get edges from placements.
 * Alias for placementsToEdges for consistency.
 */
export const getEdgesFromPlacements = (placements: Placement[]): Edge[] => {
  return placementsToEdges(placements);
};

