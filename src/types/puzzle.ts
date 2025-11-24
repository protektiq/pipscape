// Grid dimensions
export const GRID_SIZE = 6;

// Domino representation (0-6 pips per side)
export type Domino = {
  id: string;
  left: number;   // 0-6
  right: number;  // 0-6
};

// Region rule types
export const RuleType = {
  SUM_AT_LEAST: 'SUM_AT_LEAST',
  SUM_AT_MOST: 'SUM_AT_MOST',
  VALUES_EQUAL: 'VALUES_EQUAL',
  VALUES_ALL_DIFFERENT: 'VALUES_ALL_DIFFERENT',
} as const;

export type RuleType = typeof RuleType[keyof typeof RuleType];

export type RegionRule = {
  regionId: string;
  type: RuleType;
  value: number;  // Sum threshold
};

// Cell position (coordinates only, for placement operations)
export type CellPosition = {
  row: number;
  col: number;
};

// Cell coordinates with region assignment (for puzzle structure)
export type Cell = {
  row: number;
  col: number;
  regionId: string;
};

// Region: set of cells that share a constraint
export type Region = {
  id: string;
  cells: Cell[];
  rule: RegionRule;
};

// Domino placement on board
export type Placement = {
  id: string; // unique per placement (can be `${dominoId}-${row}-${col}`)
  dominoId: string;
  row: number;
  col: number; // anchor cell
  orientation: 'horizontal' | 'vertical';
  fixed?: boolean;  // For future hints (Phase 0: always false)
};

// Complete puzzle state
export type Puzzle = {
  id: string;
  seed: string;
  difficulty: 'easy' | 'medium' | 'hard';
  rows: number;  // Bounding box height
  cols: number;  // Bounding box width
  cells: Cell[]; // Sparse list of active cells (only cells that exist)
  regions: Region[];
  availableDominoes: Domino[];
  placements: Placement[];
  solution?: Placement[]; // Original solution placements (stored for solve button)
  createdAt: number;
};

// Validation result
export type ValidationResult = {
  isValid: boolean;
  invalidRegions: string[];  // Array of region IDs that don't satisfy their rules
  message: string;
};

// Helper function to build a lookup map for quick cell existence checks
export function buildCellLookup(puzzle: Puzzle): Map<string, Cell> {
  const map = new Map<string, Cell>();
  for (const cell of puzzle.cells) {
    map.set(`${cell.row}-${cell.col}`, cell);
  }
  return map;
}

