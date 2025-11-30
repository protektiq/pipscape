import type { CellPosition } from './puzzle';

/**
 * Number of pips on one side of a domino.
 * Aligned with brianberns/Pips: type PipCount = int
 */
export type PipCount = number;

/**
 * An edge represents a pair of adjacent cells where a domino can be placed.
 * In brianberns/Pips: type Edge = Cell * Cell
 * 
 * The first cell is the left/top cell, the second is the right/bottom cell.
 * For horizontal placements: [leftCell, rightCell]
 * For vertical placements: [topCell, bottomCell]
 */
export type Edge = [CellPosition, CellPosition];

/**
 * A tiling is a set of edges that cover all cells exactly once.
 * In brianberns/Pips: type Tiling = Set<Edge>
 * 
 * Each edge in the tiling represents a domino placement, and together
 * they form a complete covering of the puzzle cells.
 */
export type Tiling = Set<Edge>;

/**
 * Helper type for region constraints.
 * Aligned with brianberns/Pips RegionType
 */
export type RegionType = 
  | 'VALUES_EQUAL'
  | 'VALUES_NOT_EQUAL'
  | 'SUM_LESS_THAN'
  | 'SUM_GREATER_THAN'
  | 'SUM_EQUALS';

