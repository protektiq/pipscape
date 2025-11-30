import type { Puzzle, CellPosition, Domino } from '../types/puzzle';
import type { Board } from '../types/board';
import type { Edge } from '../types/edge';
import type { PipCount } from '../types/edge';
import { placementToEdge, edgeToPlacement } from './edgeUtils';

/**
 * Board utilities aligned with brianberns/Pips Board module.
 * Handles creation and manipulation of Board representations.
 */

/**
 * Create an empty board with -1 for all empty cells.
 * 
 * In brianberns/Pips, empty cells are marked with -1.
 * 
 * @param rows - Number of rows
 * @param cols - Number of columns
 * @param cells - Active cells that exist in the puzzle
 * @returns An empty board with -1 for empty cells, 0-6 for active cells initially empty
 */
export const createEmptyBoard = (
  rows: number,
  cols: number
): Board => {
  // Initialize 2D array with -1 (empty)
  const cellsArray: PipCount[][] = [];
  for (let row = 0; row < rows; row++) {
    cellsArray[row] = [];
    for (let col = 0; col < cols; col++) {
      cellsArray[row][col] = -1; // -1 means empty
    }
  }
  
  // Mark active cells as empty (0 would indicate a pip value, -1 means no domino placed)
  // We keep them as -1 until a domino is placed
  
  return {
    cells: cellsArray,
    dominoPlaces: [],
    rows,
    cols,
  };
};

/**
 * Place a domino on the board at the given edge.
 * Returns a new board (immutable operation).
 * 
 * Aligned with brianberns/Pips:
 * let place domino ((cellLeft, cellRight) as edge : Edge) board =
 *   let cells = Array2D.copy board.Cells
 *   cells[cellLeft.Row, cellLeft.Column] <- domino.Left
 *   cells[cellRight.Row, cellRight.Column] <- domino.Right
 *   {
 *     Cells = cells
 *     DominoPlaces = (domino, edge) :: board.DominoPlaces
 *   }
 * 
 * @param domino - The domino to place
 * @param edge - The edge (pair of cells) where to place the domino
 * @param board - The current board
 * @returns A new board with the domino placed
 */
export const placeDominoOnBoard = (
  domino: Domino,
  edge: Edge,
  board: Board
): Board => {
  // Copy the cells array (immutable update)
  const cellsArray: PipCount[][] = [];
  for (let row = 0; row < board.rows; row++) {
    cellsArray[row] = [...board.cells[row]];
  }
  
  const [cellLeft, cellRight] = edge;
  
  // Place pip values on the board
  cellsArray[cellLeft.row][cellLeft.col] = domino.left;
  cellsArray[cellRight.row][cellRight.col] = domino.right;
  
  // Add to domino places
  const newDominoPlaces = [...board.dominoPlaces, { domino, edge }];
  
  return {
    cells: cellsArray,
    dominoPlaces: newDominoPlaces,
    rows: board.rows,
    cols: board.cols,
  };
};

/**
 * Get the pip value at a specific cell on the board.
 * Returns -1 if the cell is empty.
 * 
 * @param board - The board
 * @param cell - The cell position
 * @returns The pip value (0-6) or -1 if empty
 */
export const getCellValue = (board: Board, cell: CellPosition): PipCount => {
  if (cell.row < 0 || cell.row >= board.rows || 
      cell.col < 0 || cell.col >= board.cols) {
    return -1; // Out of bounds
  }
  
  return board.cells[cell.row][cell.col];
};

/**
 * Convert a Puzzle to a Board representation.
 * 
 * @param puzzle - The puzzle to convert
 * @returns A board with all placements applied
 */
export const boardFromPuzzle = (puzzle: Puzzle): Board => {
  // Create empty board
  let board = createEmptyBoard(puzzle.rows, puzzle.cols);
  
  // Apply all placements
  for (const placement of puzzle.placements) {
    const domino = puzzle.availableDominoes.find(d => d.id === placement.dominoId);
    if (!domino) {
      continue; // Skip if domino not found
    }
    
    // Convert placement to edge
    const edge = placementToEdge(placement);
    
    // Place on board
    board = placeDominoOnBoard(domino, edge, board);
  }
  
  return board;
};

/**
 * Convert a Board back to Puzzle state (placements).
 * This creates placements from the board's domino places.
 * 
 * @param board - The board to convert
 * @param puzzle - The original puzzle (for context)
 * @returns A puzzle with placements updated from the board
 */
export const puzzleFromBoard = (board: Board, puzzle: Puzzle): Puzzle => {
  const placements = board.dominoPlaces.map(({ domino, edge }) => {
    // Find domino ID in available dominoes
    const dominoObj = puzzle.availableDominoes.find(
      d => d.left === domino.left && d.right === domino.right
    );
    
    if (!dominoObj) {
      throw new Error(`Domino ${domino.left}-${domino.right} not found in available dominoes`);
    }
    
    return edgeToPlacement(edge, dominoObj.id);
  });
  
  return {
    ...puzzle,
    placements,
  };
};

/**
 * Check if a cell is empty on the board.
 * 
 * @param board - The board
 * @param cell - The cell to check
 * @returns true if the cell is empty (-1)
 */
export const isCellEmpty = (board: Board, cell: CellPosition): boolean => {
  return getCellValue(board, cell) === -1;
};

/**
 * Check if a cell has a value on the board.
 * 
 * @param board - The board
 * @param cell - The cell to check
 * @returns true if the cell has a pip value (0-6)
 */
export const isCellOccupied = (board: Board, cell: CellPosition): boolean => {
  const value = getCellValue(board, cell);
  return value >= 0 && value <= 6;
};

