// Grid dimensions
export const GRID_SIZE = 6;

// Domino representation (0-6 pips per side)
export type Domino = {
  id: string;
  left: number;   // 0-6
  right: number;  // 0-6
};

// Region rule types (Phase 0: sum-based only)
export const RuleType = {
  SUM_AT_LEAST: 'SUM_AT_LEAST',
  SUM_AT_MOST: 'SUM_AT_MOST',
} as const;

export type RuleType = typeof RuleType[keyof typeof RuleType];

export type RegionRule = {
  regionId: string;
  type: RuleType;
  value: number;  // Sum threshold
};

// Cell coordinates
export type Cell = {
  row: number;
  col: number;
};

// Region: set of cells that share a constraint
export type Region = {
  id: string;
  cells: Cell[];
  rule: RegionRule;
};

// Domino placement on board
export type Placement = {
  dominoId: string;
  row: number;
  col: number;
  orientation: 'horizontal' | 'vertical';
  fixed?: boolean;  // For future hints (Phase 0: always false)
};

// Complete puzzle state
export type Puzzle = {
  id: string;
  seed: string;
  difficulty: 'easy' | 'medium' | 'hard';
  gridSize: number;
  regions: Region[];
  availableDominoes: Domino[];
  placements: Placement[];
  createdAt: number;
};

// Validation result
export type ValidationResult = {
  isValid: boolean;
  invalidRegions: string[];  // Array of region IDs that don't satisfy their rules
  message: string;
};

