import type { RegionRule } from '../types/puzzle';

// Pastel color palette for regions (distinct from NYT's palette)
export type RegionColor = {
  name: string;
  bg: string;      // Background color (RGB or hex)
  border: string;  // Border color (RGB or hex)
  glow: string;    // Glow color for borders (optional)
  text?: string;   // Text color for badges (optional, defaults to dark color)
};

// Rule anchor position (optional explicit position for rule badge)
export type RuleAnchor = {
  row: number;
  col: number;
  // Optional: specify which edge/corner of the cell to anchor to
  anchorPoint?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right' | 'center';
};

// Enhanced shape template with all required fields
export type ShapeTemplate = {
  // Template metadata
  id: string;
  name?: string;
  description?: string;
  difficulty: 'easy' | 'medium' | 'hard';
  
  // Grid dimensions (bounding box)
  rows: number;
  cols: number;
  
  // Cell definitions
  cells: Array<{ row: number; col: number; regionId: string }>;
  
  // Region rules
  regions: RegionRule[];
  
  // Enhanced fields
  regionColors?: Record<string, RegionColor>;  // Map of regionId to color
  ruleAnchors?: Record<string, RuleAnchor>;   // Map of regionId to explicit rule badge position
  emptySpaces?: Array<{ row: number; col: number }>;  // Explicit list of empty coordinates (for clarity)
  
  // Template statistics (for filtering/selection)
  cellCount: number;
  regionCount: number;
};

// Template metadata for listing/selection
export type TemplateMetadata = {
  id: string;
  name?: string;
  difficulty: 'easy' | 'medium' | 'hard';
  cellCount: number;
  regionCount: number;
};

