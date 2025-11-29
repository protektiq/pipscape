// Domino representation (0-6 pips per side)
export type Domino = {
  id: string;
  left: number;   // 0-6
  right: number;  // 0-6
};

// Region rule types
export const RuleType = {
  VALUES_EQUAL: 'VALUES_EQUAL',
  VALUES_NOT_EQUAL: 'VALUES_NOT_EQUAL',
  SUM_LESS_THAN: 'SUM_LESS_THAN',
  SUM_GREATER_THAN: 'SUM_GREATER_THAN',
  SUM_EQUALS: 'SUM_EQUALS',
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

// Shape template reference (imported from templates/types.ts to avoid circular dependency)
export type ShapeTemplateRef = {
  id: string;
  difficulty: 'easy' | 'medium' | 'hard';
};

// Complete puzzle state
export type Puzzle = {
  id: string;
  seed: string;
  difficulty: 'easy' | 'medium' | 'hard';
  rows: number;  // Bounding box height (explicitly set from template)
  cols: number;  // Bounding box width (explicitly set from template)
  cells: Cell[]; // Sparse list of active cells (only cells that exist)
  regions: Region[];
  availableDominoes: Domino[];
  placements: Placement[];
  solution?: Placement[]; // Original solution placements (stored for solve button)
  shapeTemplate?: ShapeTemplateRef; // Reference to the template used to generate this puzzle
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

