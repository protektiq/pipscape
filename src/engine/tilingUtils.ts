import type { CellPosition, Puzzle, Placement } from '../types/puzzle';
import type { Edge } from '../types/edge';
import { cellToKey, getAdjacentCells } from './cellUtils';
import { edgeKey, normalizeEdge, edgeToPlacement } from './edgeUtils';

/**
 * Tiling utilities aligned with brianberns/Pips Tiling module.
 * Handles generation and validation of tilings (sets of edges covering all cells).
 */

/**
 * Check if a tiling is valid (covers all cells exactly once).
 * 
 * @param cells - The cells that must be covered
 * @param edges - The edges in the tiling
 * @returns true if the tiling is valid
 */
export const isValidTiling = (cells: CellPosition[], edges: Edge[]): boolean => {
  const cellKeys = new Set(cells.map(cellToKey));
  const coveredCells = new Set<string>();
  
  for (const edge of edges) {
    const [cell1, cell2] = edge;
    const key1 = cellToKey(cell1);
    const key2 = cellToKey(cell2);
    
    // Check that both cells exist in the puzzle
    if (!cellKeys.has(key1) || !cellKeys.has(key2)) {
      return false;
    }
    
    // Check for duplicate coverage
    if (coveredCells.has(key1) || coveredCells.has(key2)) {
      return false;
    }
    
    coveredCells.add(key1);
    coveredCells.add(key2);
  }
  
  // Check that all cells are covered exactly once
  return coveredCells.size === cellKeys.size && 
         Array.from(cellKeys).every(key => coveredCells.has(key));
};

/**
 * Generate all possible tilings for a set of cells using backtracking.
 * Returns a generator that yields tilings lazily.
 * 
 * Aligned with brianberns/Pips approach of lazy sequence generation.
 * 
 * @param cells - The cells to tile
 * @returns Generator that yields valid tilings
 */
export function* generateAllTilings(cells: CellPosition[]): Generator<Edge[]> {
  if (cells.length % 2 !== 0) {
    // Cannot tile an odd number of cells with dominoes
    return;
  }
  
  const cellSet = new Set(cells.map(cellToKey));
  const coveredCells = new Set<string>();
  const currentTiling: Edge[] = [];
  
  // Helper function to get uncovered cells
  const getUncoveredCells = (): CellPosition[] => {
    return cells.filter(cell => !coveredCells.has(cellToKey(cell)));
  };
  
  // Recursive backtracking function
  const backtrack = function* (): Generator<Edge[]> {
    const uncovered = getUncoveredCells();
    
    // Base case: all cells are covered
    if (uncovered.length === 0) {
      yield [...currentTiling];
      return;
    }
    
    // Pick the first uncovered cell
    const firstCell = uncovered[0];
    const firstKey = cellToKey(firstCell);
    
    // Try each adjacent cell as a neighbor for the domino
    const neighbors = getAdjacentCells(firstCell);
    
    for (const neighbor of neighbors) {
      const neighborKey = cellToKey(neighbor);
      
      // Check if neighbor is valid (exists and uncovered)
      if (!cellSet.has(neighborKey) || coveredCells.has(neighborKey)) {
        continue;
      }
      
      // Create edge for this domino
      const edge: Edge = [firstCell, neighbor];
      const normalizedEdge = normalizeEdge(edge);
      
      // Add to current tiling
      currentTiling.push(normalizedEdge);
      coveredCells.add(firstKey);
      coveredCells.add(neighborKey);
      
      // Recursively find remaining tilings
      yield* backtrack();
      
      // Backtrack: remove this edge
      currentTiling.pop();
      coveredCells.delete(firstKey);
      coveredCells.delete(neighborKey);
    }
  };
  
  yield* backtrack();
}

/**
 * Convert a tiling (set of edges) to placements for a puzzle.
 * 
 * @param tiling - The tiling (set of edges)
 * @param _puzzle - The puzzle context (unused)
 * @param dominoMappings - Mapping of edges to domino IDs
 * @returns Array of placements
 */
export const tilingToPlacements = (
  tiling: Edge[],
  _puzzle: Puzzle,
  dominoMappings: Array<{ edge: Edge; dominoId: string }>
): Placement[] => {
  const placements: Placement[] = [];
  
  for (const mapping of dominoMappings) {
    // Verify the edge exists in the tiling
    const edgeExists = tiling.some(edge => 
      edgeKey(edge) === edgeKey(mapping.edge)
    );
    
    if (edgeExists) {
      const placement = edgeToPlacement(mapping.edge, mapping.dominoId);
      placements.push(placement);
    }
  }
  
  return placements;
};

/**
 * Validate that a tiling satisfies all region constraints.
 * 
 * @param tiling - The tiling to validate
 * @param puzzle - The puzzle context
 * @returns true if all constraints are satisfied
 */
export const validateTilingConstraints = (
  tiling: Edge[],
  puzzle: Puzzle
): boolean => {
  // This is a simplified validation - full validation would check region rules
  // For now, we'll validate that the tiling structure is correct
  // Full constraint validation is done in the solver using the validator
  
  // Check that tiling is valid structure-wise
  const cellPositions: CellPosition[] = puzzle.cells.map(cell => ({
    row: cell.row,
    col: cell.col,
  }));
  
  return isValidTiling(cellPositions, tiling);
};

/**
 * Check if a tiling covers a specific cell.
 * 
 * @param tiling - The tiling (set of edges)
 * @param cell - The cell to check
 * @returns true if the cell is covered by the tiling
 */
export const tilingCoversCell = (tiling: Edge[], cell: CellPosition): boolean => {
  const cellKey = cellToKey(cell);
  
  for (const edge of tiling) {
    const [cell1, cell2] = edge;
    if (cellToKey(cell1) === cellKey || cellToKey(cell2) === cellKey) {
      return true;
    }
  }
  
  return false;
};

/**
 * Get the edge in a tiling that covers a specific cell.
 * 
 * @param tiling - The tiling (set of edges)
 * @param cell - The cell to find
 * @returns The edge covering this cell, or null if not found
 */
export const getEdgeCoveringCell = (tiling: Edge[], cell: CellPosition): Edge | null => {
  const cellKey = cellToKey(cell);
  
  for (const edge of tiling) {
    const [cell1, cell2] = edge;
    if (cellToKey(cell1) === cellKey || cellToKey(cell2) === cellKey) {
      return edge;
    }
  }
  
  return null;
};

