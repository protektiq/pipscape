import type { Domino } from './puzzle';
import type { Edge } from './edge';
import type { PipCount } from './edge';

/**
 * Board representation aligned with brianberns/Pips.
 * 
 * Stores the pip values at each cell position:
 * - -1 indicates an empty cell
 * - 0-6 indicates the number of pips at that cell (from a placed domino)
 * 
 * In brianberns/Pips:
 * type Board = {
 *   DominoPlaces : List<Domino * Edge>
 *   Cells : PipCount[(*row*), (*column*)]
 * }
 */
export type Board = {
  /**
   * The pip values stored in a 2D array.
   * Indexed as [row][col], with -1 for empty cells.
   */
  cells: PipCount[][];

  /**
   * The domino placements on the board.
   * Each entry is a domino and the edge where it's placed.
   */
  dominoPlaces: Array<{ domino: Domino; edge: Edge }>;

  /**
   * Number of rows in the board
   */
  rows: number;

  /**
   * Number of columns in the board
   */
  cols: number;
};

