import type { RegionRule } from '../types/puzzle';
import { RuleType } from '../types/puzzle';

export type ShapeTemplate = {
  rows: number;
  cols: number;
  cells: { row: number; col: number; regionId: string }[];
  regions: RegionRule[];
};

// Easy templates - simpler shapes, fewer regions (8-14 cells, 2-5 regions)
// Each region is a rectangular block, but overall puzzle shape is irregular
// New templates include single-cell regions for easier difficulty matching screenshot
export const EASY_TEMPLATES: ShapeTemplate[] = [
  // Template 0: Screenshot-style puzzle with single-cell regions (10 cells)
  {
    rows: 4,
    cols: 4,
    cells: [
      // Region 0: Single cell (top-left)
      { row: 0, col: 0, regionId: 'region-0' },
      // Region 1: 2 cells vertical (top-right)
      { row: 0, col: 2, regionId: 'region-1' },
      { row: 1, col: 2, regionId: 'region-1' },
      // Region 2: Single cell (middle-left)
      { row: 2, col: 0, regionId: 'region-2' },
      // Region 3: 4 cells horizontal (middle)
      { row: 1, col: 0, regionId: 'region-3' },
      { row: 1, col: 1, regionId: 'region-3' },
      { row: 2, col: 1, regionId: 'region-3' },
      { row: 2, col: 2, regionId: 'region-3' },
      // Region 4: Single cell (bottom-right)
      { row: 3, col: 2, regionId: 'region-4' },
      // Region 5: Single cell (bottom-left)
      { row: 3, col: 0, regionId: 'region-5' },
    ],
    regions: [
      { regionId: 'region-0', type: RuleType.SUM_LESS_THAN, value: 3 },
      { regionId: 'region-1', type: RuleType.SUM_EQUALS, value: 6 },
      { regionId: 'region-2', type: RuleType.SUM_EQUALS, value: 6 },
      { regionId: 'region-3', type: RuleType.SUM_EQUALS, value: 10 },
      { regionId: 'region-4', type: RuleType.SUM_EQUALS, value: 6 },
      { regionId: 'region-5', type: RuleType.SUM_LESS_THAN, value: 3 },
    ],
  },
  // Template 0b: Similar to screenshot but different layout (10 cells)
  {
    rows: 4,
    cols: 3,
    cells: [
      // Region 0: Single cell (top-left)
      { row: 0, col: 0, regionId: 'region-0' },
      // Region 1: 2 cells vertical (top-right)
      { row: 0, col: 2, regionId: 'region-1' },
      { row: 1, col: 2, regionId: 'region-1' },
      // Region 2: Single cell (middle-left)
      { row: 2, col: 0, regionId: 'region-2' },
      // Region 3: 4 cells horizontal (middle)
      { row: 1, col: 0, regionId: 'region-3' },
      { row: 1, col: 1, regionId: 'region-3' },
      { row: 2, col: 1, regionId: 'region-3' },
      { row: 2, col: 2, regionId: 'region-3' },
      // Region 4: Single cell (bottom)
      { row: 3, col: 1, regionId: 'region-4' },
      // Region 5: Single cell (bottom-left)
      { row: 3, col: 0, regionId: 'region-5' },
    ],
    regions: [
      { regionId: 'region-0', type: RuleType.SUM_LESS_THAN, value: 3 },
      { regionId: 'region-1', type: RuleType.SUM_EQUALS, value: 6 },
      { regionId: 'region-2', type: RuleType.SUM_EQUALS, value: 6 },
      { regionId: 'region-3', type: RuleType.SUM_EQUALS, value: 10 },
      { regionId: 'region-4', type: RuleType.SUM_EQUALS, value: 6 },
      { regionId: 'region-5', type: RuleType.SUM_LESS_THAN, value: 3 },
    ],
  },
  // Template 0c: Compact puzzle with single-cell regions (8 cells)
  {
    rows: 3,
    cols: 4,
    cells: [
      // Region 0: Single cell (top-left)
      { row: 0, col: 0, regionId: 'region-0' },
      // Region 1: 2 cells vertical (top-right)
      { row: 0, col: 2, regionId: 'region-1' },
      { row: 1, col: 2, regionId: 'region-1' },
      // Region 2: Single cell (middle-left)
      { row: 1, col: 0, regionId: 'region-2' },
      // Region 3: 4 cells horizontal (middle)
      { row: 0, col: 1, regionId: 'region-3' },
      { row: 1, col: 1, regionId: 'region-3' },
      { row: 2, col: 1, regionId: 'region-3' },
      { row: 2, col: 2, regionId: 'region-3' },
    ],
    regions: [
      { regionId: 'region-0', type: RuleType.SUM_LESS_THAN, value: 3 },
      { regionId: 'region-1', type: RuleType.SUM_EQUALS, value: 6 },
      { regionId: 'region-2', type: RuleType.SUM_EQUALS, value: 6 },
      { regionId: 'region-3', type: RuleType.SUM_EQUALS, value: 10 },
    ],
  },
  // Template 0d: Simple puzzle with single-cell regions (10 cells)
  {
    rows: 4,
    cols: 3,
    cells: [
      // Region 0: Single cell (top-left)
      { row: 0, col: 0, regionId: 'region-0' },
      // Region 1: Single cell (top-right)
      { row: 0, col: 2, regionId: 'region-1' },
      // Region 2: 2 cells vertical (middle-left)
      { row: 1, col: 0, regionId: 'region-2' },
      { row: 2, col: 0, regionId: 'region-2' },
      // Region 3: 4 cells horizontal (middle)
      { row: 1, col: 1, regionId: 'region-3' },
      { row: 1, col: 2, regionId: 'region-3' },
      { row: 2, col: 1, regionId: 'region-3' },
      { row: 2, col: 2, regionId: 'region-3' },
      // Region 4: Single cell (bottom-left)
      { row: 3, col: 0, regionId: 'region-4' },
      // Region 5: Single cell (bottom-right)
      { row: 3, col: 2, regionId: 'region-5' },
    ],
    regions: [
      { regionId: 'region-0', type: RuleType.SUM_LESS_THAN, value: 3 },
      { regionId: 'region-1', type: RuleType.SUM_EQUALS, value: 6 },
      { regionId: 'region-2', type: RuleType.SUM_EQUALS, value: 6 },
      { regionId: 'region-3', type: RuleType.SUM_EQUALS, value: 10 },
      { regionId: 'region-4', type: RuleType.SUM_LESS_THAN, value: 3 },
      { regionId: 'region-5', type: RuleType.SUM_EQUALS, value: 6 },
    ],
  },
  // Template 0e: Minimal puzzle with single-cell regions (8 cells)
  {
    rows: 3,
    cols: 4,
    cells: [
      // Region 0: Single cell (top-left)
      { row: 0, col: 0, regionId: 'region-0' },
      // Region 1: Single cell (top-right)
      { row: 0, col: 3, regionId: 'region-1' },
      // Region 2: 2 cells vertical (middle-left)
      { row: 1, col: 0, regionId: 'region-2' },
      { row: 2, col: 0, regionId: 'region-2' },
      // Region 3: 4 cells horizontal (middle-right)
      { row: 0, col: 1, regionId: 'region-3' },
      { row: 0, col: 2, regionId: 'region-3' },
      { row: 1, col: 1, regionId: 'region-3' },
      { row: 1, col: 2, regionId: 'region-3' },
    ],
    regions: [
      { regionId: 'region-0', type: RuleType.SUM_LESS_THAN, value: 3 },
      { regionId: 'region-1', type: RuleType.SUM_EQUALS, value: 6 },
      { regionId: 'region-2', type: RuleType.SUM_EQUALS, value: 6 },
      { regionId: 'region-3', type: RuleType.SUM_EQUALS, value: 10 },
    ],
  },
  // Template 1: Small L-shape puzzle with rectangular regions (8 cells)
  {
    rows: 4,
    cols: 3,
    cells: [
      // Region 0: 2x2 block (top-left)
      { row: 0, col: 0, regionId: 'region-0' },
      { row: 0, col: 1, regionId: 'region-0' },
      { row: 1, col: 0, regionId: 'region-0' },
      { row: 1, col: 1, regionId: 'region-0' },
      // Region 1: 2x2 block (bottom-right)
      { row: 2, col: 1, regionId: 'region-1' },
      { row: 2, col: 2, regionId: 'region-1' },
      { row: 3, col: 1, regionId: 'region-1' },
      { row: 3, col: 2, regionId: 'region-1' },
    ],
    regions: [
      { regionId: 'region-0', type: RuleType.SUM_LESS_THAN, value: 12 },
      { regionId: 'region-1', type: RuleType.SUM_EQUALS, value: 10 },
    ],
  },
  // Template 2: T-shape puzzle with rectangular regions (10 cells)
  {
    rows: 4,
    cols: 4,
    cells: [
      // Region 0: 2x2 block (top of T)
      { row: 0, col: 1, regionId: 'region-0' },
      { row: 0, col: 2, regionId: 'region-0' },
      { row: 1, col: 1, regionId: 'region-0' },
      { row: 1, col: 2, regionId: 'region-0' },
      // Region 1: 2x2 block (middle of T)
      { row: 2, col: 1, regionId: 'region-1' },
      { row: 2, col: 2, regionId: 'region-1' },
      { row: 3, col: 1, regionId: 'region-1' },
      { row: 3, col: 2, regionId: 'region-1' },
      // Region 2: 2x1 block (bottom of T)
      { row: 3, col: 0, regionId: 'region-2' },
      { row: 3, col: 3, regionId: 'region-2' },
    ],
    regions: [
      { regionId: 'region-0', type: RuleType.SUM_LESS_THAN, value: 12 },
      { regionId: 'region-1', type: RuleType.SUM_EQUALS, value: 12 },
      { regionId: 'region-2', type: RuleType.SUM_LESS_THAN, value: 8 },
    ],
  },
  // Template 3: Irregular shape with rectangular regions (10 cells)
  {
    rows: 4,
    cols: 4,
    cells: [
      // Region 0: 2x2 block (top-left)
      { row: 0, col: 0, regionId: 'region-0' },
      { row: 0, col: 1, regionId: 'region-0' },
      { row: 1, col: 0, regionId: 'region-0' },
      { row: 1, col: 1, regionId: 'region-0' },
      // Region 1: 2x1 block (top-right)
      { row: 0, col: 3, regionId: 'region-1' },
      { row: 1, col: 3, regionId: 'region-1' },
      // Region 2: 2x2 block (bottom)
      { row: 2, col: 1, regionId: 'region-2' },
      { row: 2, col: 2, regionId: 'region-2' },
      { row: 3, col: 1, regionId: 'region-2' },
      { row: 3, col: 2, regionId: 'region-2' },
    ],
    regions: [
      { regionId: 'region-0', type: RuleType.SUM_EQUALS, value: 10 },
      { regionId: 'region-1', type: RuleType.SUM_LESS_THAN, value: 8 },
      { regionId: 'region-2', type: RuleType.SUM_EQUALS, value: 12 },
    ],
  },
  // Template 4: C-shape puzzle with rectangular regions (12 cells)
  {
    rows: 4,
    cols: 4,
    cells: [
      // Region 0: 2x2 block (top-left)
      { row: 0, col: 0, regionId: 'region-0' },
      { row: 0, col: 1, regionId: 'region-0' },
      { row: 1, col: 0, regionId: 'region-0' },
      { row: 1, col: 1, regionId: 'region-0' },
      // Region 1: 2x1 block (left side)
      { row: 2, col: 0, regionId: 'region-1' },
      { row: 3, col: 0, regionId: 'region-1' },
      // Region 2: 2x2 block (bottom)
      { row: 2, col: 1, regionId: 'region-2' },
      { row: 2, col: 2, regionId: 'region-2' },
      { row: 3, col: 1, regionId: 'region-2' },
      { row: 3, col: 2, regionId: 'region-2' },
      // Region 3: 2x1 block (top-right)
      { row: 0, col: 2, regionId: 'region-3' },
      { row: 1, col: 2, regionId: 'region-3' },
    ],
    regions: [
      { regionId: 'region-0', type: RuleType.SUM_LESS_THAN, value: 12 },
      { regionId: 'region-1', type: RuleType.SUM_EQUALS, value: 6 },
      { regionId: 'region-2', type: RuleType.SUM_EQUALS, value: 12 },
      { regionId: 'region-3', type: RuleType.SUM_LESS_THAN, value: 8 },
    ],
  },
  // Template 5: Irregular shape with rectangular regions (12 cells)
  {
    rows: 4,
    cols: 4,
    cells: [
      // Region 0: 2x2 block (top-left)
      { row: 0, col: 0, regionId: 'region-0' },
      { row: 0, col: 1, regionId: 'region-0' },
      { row: 1, col: 0, regionId: 'region-0' },
      { row: 1, col: 1, regionId: 'region-0' },
      // Region 1: 2x2 block (top-right)
      { row: 0, col: 2, regionId: 'region-1' },
      { row: 0, col: 3, regionId: 'region-1' },
      { row: 1, col: 2, regionId: 'region-1' },
      { row: 1, col: 3, regionId: 'region-1' },
      // Region 2: 2x2 block (bottom-left)
      { row: 2, col: 0, regionId: 'region-2' },
      { row: 2, col: 1, regionId: 'region-2' },
      { row: 3, col: 0, regionId: 'region-2' },
      { row: 3, col: 1, regionId: 'region-2' },
    ],
    regions: [
      { regionId: 'region-0', type: RuleType.SUM_LESS_THAN, value: 12 },
      { regionId: 'region-1', type: RuleType.SUM_EQUALS, value: 12 },
      { regionId: 'region-2', type: RuleType.SUM_LESS_THAN, value: 12 },
    ],
  },
  // Template 6: I-shape puzzle with rectangular regions (14 cells)
  {
    rows: 5,
    cols: 3,
    cells: [
      // Region 0: 2x2 block (top)
      { row: 0, col: 0, regionId: 'region-0' },
      { row: 0, col: 1, regionId: 'region-0' },
      { row: 1, col: 0, regionId: 'region-0' },
      { row: 1, col: 1, regionId: 'region-0' },
      // Region 1: 2x1 block (middle-left)
      { row: 2, col: 0, regionId: 'region-1' },
      { row: 3, col: 0, regionId: 'region-1' },
      // Region 2: 2x2 block (middle-right)
      { row: 2, col: 1, regionId: 'region-2' },
      { row: 2, col: 2, regionId: 'region-2' },
      { row: 3, col: 1, regionId: 'region-2' },
      { row: 3, col: 2, regionId: 'region-2' },
      // Region 3: 2x1 block (bottom)
      { row: 4, col: 0, regionId: 'region-3' },
      { row: 4, col: 1, regionId: 'region-3' },
      // Region 4: 2x1 block (top-right)
      { row: 0, col: 2, regionId: 'region-4' },
      { row: 1, col: 2, regionId: 'region-4' },
    ],
    regions: [
      { regionId: 'region-0', type: RuleType.SUM_LESS_THAN, value: 12 },
      { regionId: 'region-1', type: RuleType.SUM_EQUALS, value: 6 },
      { regionId: 'region-2', type: RuleType.SUM_EQUALS, value: 12 },
      { regionId: 'region-3', type: RuleType.SUM_LESS_THAN, value: 8 },
      { regionId: 'region-4', type: RuleType.SUM_LESS_THAN, value: 8 },
    ],
  },
  // Template 7: Cross-shape puzzle with rectangular regions (14 cells)
  {
    rows: 4,
    cols: 4,
    cells: [
      // Region 0: 2x1 block (top)
      { row: 0, col: 1, regionId: 'region-0' },
      { row: 0, col: 2, regionId: 'region-0' },
      // Region 1: 2x2 block (center)
      { row: 1, col: 1, regionId: 'region-1' },
      { row: 1, col: 2, regionId: 'region-1' },
      { row: 2, col: 1, regionId: 'region-1' },
      { row: 2, col: 2, regionId: 'region-1' },
      // Region 2: 2x1 block (left)
      { row: 1, col: 0, regionId: 'region-2' },
      { row: 2, col: 0, regionId: 'region-2' },
      // Region 3: 2x1 block (right)
      { row: 1, col: 3, regionId: 'region-3' },
      { row: 2, col: 3, regionId: 'region-3' },
      // Region 4: 2x1 block (bottom)
      { row: 3, col: 1, regionId: 'region-4' },
      { row: 3, col: 2, regionId: 'region-4' },
      // Region 5: 2x1 block (top corners)
      { row: 0, col: 0, regionId: 'region-5' },
      { row: 0, col: 3, regionId: 'region-5' },
    ],
    regions: [
      { regionId: 'region-0', type: RuleType.SUM_LESS_THAN, value: 8 },
      { regionId: 'region-1', type: RuleType.SUM_EQUALS, value: 12 },
      { regionId: 'region-2', type: RuleType.SUM_LESS_THAN, value: 8 },
      { regionId: 'region-3', type: RuleType.SUM_LESS_THAN, value: 8 },
      { regionId: 'region-4', type: RuleType.SUM_LESS_THAN, value: 8 },
      { regionId: 'region-5', type: RuleType.SUM_EQUALS, value: 6 },
    ],
  },
  // Template 8: Snake-shape puzzle with rectangular regions (14 cells)
  {
    rows: 4,
    cols: 5,
    cells: [
      // Region 0: 2x2 block (top-left)
      { row: 0, col: 0, regionId: 'region-0' },
      { row: 0, col: 1, regionId: 'region-0' },
      { row: 1, col: 0, regionId: 'region-0' },
      { row: 1, col: 1, regionId: 'region-0' },
      // Region 1: 2x2 block (middle)
      { row: 1, col: 2, regionId: 'region-1' },
      { row: 1, col: 3, regionId: 'region-1' },
      { row: 2, col: 2, regionId: 'region-1' },
      { row: 2, col: 3, regionId: 'region-1' },
      // Region 2: 2x2 block (bottom-right)
      { row: 2, col: 3, regionId: 'region-2' },
      { row: 2, col: 4, regionId: 'region-2' },
      { row: 3, col: 3, regionId: 'region-2' },
      { row: 3, col: 4, regionId: 'region-2' },
      // Region 3: 2x1 block (top-right)
      { row: 0, col: 3, regionId: 'region-3' },
      { row: 0, col: 4, regionId: 'region-3' },
    ],
    regions: [
      { regionId: 'region-0', type: RuleType.SUM_LESS_THAN, value: 12 },
      { regionId: 'region-1', type: RuleType.SUM_EQUALS, value: 12 },
      { regionId: 'region-2', type: RuleType.SUM_LESS_THAN, value: 12 },
      { regionId: 'region-3', type: RuleType.SUM_LESS_THAN, value: 8 },
    ],
  },
  // Template 9: L-shape puzzle with rectangular regions (10 cells)
  {
    rows: 4,
    cols: 3,
    cells: [
      // Region 0: 2x2 block (top-left)
      { row: 0, col: 0, regionId: 'region-0' },
      { row: 0, col: 1, regionId: 'region-0' },
      { row: 1, col: 0, regionId: 'region-0' },
      { row: 1, col: 1, regionId: 'region-0' },
      // Region 1: 2x1 block (left side)
      { row: 2, col: 0, regionId: 'region-1' },
      { row: 3, col: 0, regionId: 'region-1' },
      // Region 2: 2x2 block (bottom-right)
      { row: 2, col: 1, regionId: 'region-2' },
      { row: 2, col: 2, regionId: 'region-2' },
      { row: 3, col: 1, regionId: 'region-2' },
      { row: 3, col: 2, regionId: 'region-2' },
    ],
    regions: [
      { regionId: 'region-0', type: RuleType.SUM_LESS_THAN, value: 12 },
      { regionId: 'region-1', type: RuleType.SUM_EQUALS, value: 6 },
      { regionId: 'region-2', type: RuleType.SUM_EQUALS, value: 12 },
    ],
  },
  // Template 10: S-shape puzzle with rectangular regions (12 cells)
  {
    rows: 4,
    cols: 4,
    cells: [
      // Region 0: 2x2 block (top-left)
      { row: 0, col: 0, regionId: 'region-0' },
      { row: 0, col: 1, regionId: 'region-0' },
      { row: 1, col: 0, regionId: 'region-0' },
      { row: 1, col: 1, regionId: 'region-0' },
      // Region 1: 2x2 block (middle)
      { row: 1, col: 2, regionId: 'region-1' },
      { row: 1, col: 3, regionId: 'region-1' },
      { row: 2, col: 2, regionId: 'region-1' },
      { row: 2, col: 3, regionId: 'region-1' },
      // Region 2: 2x2 block (bottom-left)
      { row: 2, col: 0, regionId: 'region-2' },
      { row: 2, col: 1, regionId: 'region-2' },
      { row: 3, col: 0, regionId: 'region-2' },
      { row: 3, col: 1, regionId: 'region-2' },
    ],
    regions: [
      { regionId: 'region-0', type: RuleType.SUM_LESS_THAN, value: 12 },
      { regionId: 'region-1', type: RuleType.SUM_EQUALS, value: 12 },
      { regionId: 'region-2', type: RuleType.SUM_LESS_THAN, value: 12 },
    ],
  },
];

// Medium templates - more complex shapes, more regions (16-24 cells, 4-6 regions)
export const MEDIUM_TEMPLATES: ShapeTemplate[] = [
  // Template 1: Letter R shape with rectangular regions (18 cells)
  {
    rows: 5,
    cols: 4,
    cells: [
      // Region 0: 2x2 block (top-left)
      { row: 0, col: 0, regionId: 'region-0' },
      { row: 0, col: 1, regionId: 'region-0' },
      { row: 1, col: 0, regionId: 'region-0' },
      { row: 1, col: 1, regionId: 'region-0' },
      // Region 1: 2x2 block (top-right)
      { row: 0, col: 2, regionId: 'region-1' },
      { row: 0, col: 3, regionId: 'region-1' },
      { row: 1, col: 2, regionId: 'region-1' },
      { row: 1, col: 3, regionId: 'region-1' },
      // Region 2: 2x2 block (middle-left)
      { row: 2, col: 0, regionId: 'region-2' },
      { row: 2, col: 1, regionId: 'region-2' },
      { row: 3, col: 0, regionId: 'region-2' },
      { row: 3, col: 1, regionId: 'region-2' },
      // Region 3: 2x2 block (middle-right)
      { row: 2, col: 2, regionId: 'region-3' },
      { row: 2, col: 3, regionId: 'region-3' },
      { row: 3, col: 2, regionId: 'region-3' },
      { row: 3, col: 3, regionId: 'region-3' },
      // Region 4: 2x1 block (bottom-left)
      { row: 4, col: 0, regionId: 'region-4' },
      { row: 4, col: 1, regionId: 'region-4' },
    ],
    regions: [
      { regionId: 'region-0', type: RuleType.SUM_LESS_THAN, value: 12 },
      { regionId: 'region-1', type: RuleType.SUM_EQUALS, value: 12 },
      { regionId: 'region-2', type: RuleType.SUM_LESS_THAN, value: 12 },
      { regionId: 'region-3', type: RuleType.SUM_LESS_THAN, value: 12 },
      { regionId: 'region-4', type: RuleType.SUM_EQUALS, value: 6 },
    ],
  },
  // Template 2: Letter P shape with rectangular regions (18 cells)
  {
    rows: 5,
    cols: 4,
    cells: [
      // Region 0: 2x2 block (top-left)
      { row: 0, col: 0, regionId: 'region-0' },
      { row: 0, col: 1, regionId: 'region-0' },
      { row: 1, col: 0, regionId: 'region-0' },
      { row: 1, col: 1, regionId: 'region-0' },
      // Region 1: 2x2 block (top-right)
      { row: 0, col: 2, regionId: 'region-1' },
      { row: 0, col: 3, regionId: 'region-1' },
      { row: 1, col: 2, regionId: 'region-1' },
      { row: 1, col: 3, regionId: 'region-1' },
      // Region 2: 2x2 block (middle-left)
      { row: 2, col: 0, regionId: 'region-2' },
      { row: 2, col: 1, regionId: 'region-2' },
      { row: 3, col: 0, regionId: 'region-2' },
      { row: 3, col: 1, regionId: 'region-2' },
      // Region 3: 2x2 block (middle-right)
      { row: 2, col: 2, regionId: 'region-3' },
      { row: 2, col: 3, regionId: 'region-3' },
      { row: 3, col: 2, regionId: 'region-3' },
      { row: 3, col: 3, regionId: 'region-3' },
      // Region 4: 2x1 block (bottom-left)
      { row: 4, col: 0, regionId: 'region-4' },
      { row: 4, col: 1, regionId: 'region-4' },
    ],
    regions: [
      { regionId: 'region-0', type: RuleType.SUM_LESS_THAN, value: 12 },
      { regionId: 'region-1', type: RuleType.SUM_EQUALS, value: 12 },
      { regionId: 'region-2', type: RuleType.SUM_LESS_THAN, value: 12 },
      { regionId: 'region-3', type: RuleType.SUM_LESS_THAN, value: 12 },
      { regionId: 'region-4', type: RuleType.SUM_EQUALS, value: 6 },
    ],
  },
  // Template 3: Complex L-shape with rectangular regions (20 cells)
  {
    rows: 5,
    cols: 5,
    cells: [
      // Region 0: 2x2 block (top-left)
      { row: 0, col: 0, regionId: 'region-0' },
      { row: 0, col: 1, regionId: 'region-0' },
      { row: 1, col: 0, regionId: 'region-0' },
      { row: 1, col: 1, regionId: 'region-0' },
      // Region 1: 2x1 block (left side)
      { row: 2, col: 0, regionId: 'region-1' },
      { row: 3, col: 0, regionId: 'region-1' },
      // Region 2: 2x1 block (left side bottom)
      { row: 4, col: 0, regionId: 'region-2' },
      { row: 4, col: 1, regionId: 'region-2' },
      // Region 3: 2x2 block (top-right)
      { row: 0, col: 2, regionId: 'region-3' },
      { row: 0, col: 3, regionId: 'region-3' },
      { row: 1, col: 2, regionId: 'region-3' },
      { row: 1, col: 3, regionId: 'region-3' },
      // Region 4: 2x2 block (middle-right)
      { row: 2, col: 2, regionId: 'region-4' },
      { row: 2, col: 3, regionId: 'region-4' },
      { row: 3, col: 2, regionId: 'region-4' },
      { row: 3, col: 3, regionId: 'region-4' },
      // Region 5: 2x2 block (bottom-right)
      { row: 2, col: 4, regionId: 'region-5' },
      { row: 3, col: 4, regionId: 'region-5' },
      { row: 4, col: 2, regionId: 'region-5' },
      { row: 4, col: 3, regionId: 'region-5' },
    ],
    regions: [
      { regionId: 'region-0', type: RuleType.SUM_LESS_THAN, value: 12 },
      { regionId: 'region-1', type: RuleType.SUM_EQUALS, value: 6 },
      { regionId: 'region-2', type: RuleType.SUM_LESS_THAN, value: 8 },
      { regionId: 'region-3', type: RuleType.SUM_EQUALS, value: 12 },
      { regionId: 'region-4', type: RuleType.SUM_LESS_THAN, value: 12 },
      { regionId: 'region-5', type: RuleType.SUM_LESS_THAN, value: 12 },
    ],
  },
  // Template 4: Tetris combination (20 cells)
  {
    rows: 5,
    cols: 5,
    cells: [
      { row: 0, col: 1, regionId: 'region-0' },
      { row: 0, col: 2, regionId: 'region-0' },
      { row: 0, col: 3, regionId: 'region-0' },
      { row: 1, col: 1, regionId: 'region-0' },
      { row: 1, col: 2, regionId: 'region-0' },
      { row: 2, col: 0, regionId: 'region-1' },
      { row: 2, col: 1, regionId: 'region-1' },
      { row: 2, col: 2, regionId: 'region-1' },
      { row: 3, col: 0, regionId: 'region-1' },
      { row: 3, col: 1, regionId: 'region-1' },
      { row: 1, col: 3, regionId: 'region-2' },
      { row: 1, col: 4, regionId: 'region-2' },
      { row: 2, col: 3, regionId: 'region-2' },
      { row: 2, col: 4, regionId: 'region-2' },
      { row: 3, col: 2, regionId: 'region-3' },
      { row: 3, col: 3, regionId: 'region-3' },
      { row: 3, col: 4, regionId: 'region-3' },
      { row: 4, col: 2, regionId: 'region-3' },
      { row: 4, col: 3, regionId: 'region-3' },
      { row: 4, col: 4, regionId: 'region-3' },
    ],
    regions: [
      { regionId: 'region-0', type: RuleType.SUM_LESS_THAN, value: 14 },
      { regionId: 'region-1', type: RuleType.SUM_EQUALS, value: 12 },
      { regionId: 'region-2', type: RuleType.SUM_LESS_THAN, value: 12 },
      { regionId: 'region-3', type: RuleType.SUM_LESS_THAN, value: 16 },
    ],
  },
  // Template 5: Interlocking shapes (22 cells)
  {
    rows: 5,
    cols: 5,
    cells: [
      { row: 0, col: 0, regionId: 'region-0' },
      { row: 0, col: 1, regionId: 'region-0' },
      { row: 1, col: 0, regionId: 'region-0' },
      { row: 1, col: 1, regionId: 'region-0' },
      { row: 2, col: 0, regionId: 'region-0' },
      { row: 0, col: 2, regionId: 'region-1' },
      { row: 0, col: 3, regionId: 'region-1' },
      { row: 1, col: 2, regionId: 'region-1' },
      { row: 1, col: 3, regionId: 'region-1' },
      { row: 2, col: 2, regionId: 'region-1' },
      { row: 2, col: 3, regionId: 'region-1' },
      { row: 0, col: 4, regionId: 'region-2' },
      { row: 1, col: 4, regionId: 'region-2' },
      { row: 2, col: 1, regionId: 'region-2' },
      { row: 2, col: 4, regionId: 'region-2' },
      { row: 3, col: 1, regionId: 'region-3' },
      { row: 3, col: 2, regionId: 'region-3' },
      { row: 3, col: 3, regionId: 'region-3' },
      { row: 4, col: 1, regionId: 'region-3' },
      { row: 4, col: 2, regionId: 'region-3' },
      { row: 4, col: 3, regionId: 'region-3' },
      { row: 3, col: 4, regionId: 'region-3' },
    ],
    regions: [
      { regionId: 'region-0', type: RuleType.SUM_LESS_THAN, value: 12 },
      { regionId: 'region-1', type: RuleType.SUM_EQUALS, value: 14 },
      { regionId: 'region-2', type: RuleType.SUM_LESS_THAN, value: 10 },
      { regionId: 'region-3', type: RuleType.SUM_LESS_THAN, value: 18 },
    ],
  },
  // Template 6: Letter F shape (22 cells)
  {
    rows: 5,
    cols: 4,
    cells: [
      { row: 0, col: 0, regionId: 'region-0' },
      { row: 0, col: 1, regionId: 'region-0' },
      { row: 0, col: 2, regionId: 'region-0' },
      { row: 0, col: 3, regionId: 'region-0' },
      { row: 1, col: 0, regionId: 'region-0' },
      { row: 2, col: 0, regionId: 'region-0' },
      { row: 2, col: 1, regionId: 'region-0' },
      { row: 2, col: 2, regionId: 'region-0' },
      { row: 3, col: 0, regionId: 'region-1' },
      { row: 4, col: 0, regionId: 'region-1' },
      { row: 1, col: 1, regionId: 'region-2' },
      { row: 1, col: 2, regionId: 'region-2' },
      { row: 1, col: 3, regionId: 'region-2' },
      { row: 3, col: 1, regionId: 'region-2' },
      { row: 3, col: 2, regionId: 'region-2' },
      { row: 3, col: 3, regionId: 'region-2' },
      { row: 4, col: 1, regionId: 'region-2' },
      { row: 4, col: 2, regionId: 'region-2' },
      { row: 4, col: 3, regionId: 'region-2' },
      { row: 2, col: 3, regionId: 'region-2' },
    ],
    regions: [
      { regionId: 'region-0', type: RuleType.SUM_LESS_THAN, value: 18 },
      { regionId: 'region-1', type: RuleType.SUM_EQUALS, value: 6 },
      { regionId: 'region-2', type: RuleType.SUM_LESS_THAN, value: 16 },
    ],
  },
  // Template 7: Multiple islands (24 cells)
  {
    rows: 6,
    cols: 5,
    cells: [
      { row: 0, col: 0, regionId: 'region-0' },
      { row: 0, col: 1, regionId: 'region-0' },
      { row: 1, col: 0, regionId: 'region-0' },
      { row: 1, col: 1, regionId: 'region-0' },
      { row: 0, col: 3, regionId: 'region-1' },
      { row: 0, col: 4, regionId: 'region-1' },
      { row: 1, col: 3, regionId: 'region-1' },
      { row: 1, col: 4, regionId: 'region-1' },
      { row: 2, col: 1, regionId: 'region-2' },
      { row: 2, col: 2, regionId: 'region-2' },
      { row: 3, col: 1, regionId: 'region-2' },
      { row: 3, col: 2, regionId: 'region-2' },
      { row: 2, col: 3, regionId: 'region-3' },
      { row: 2, col: 4, regionId: 'region-3' },
      { row: 3, col: 3, regionId: 'region-3' },
      { row: 3, col: 4, regionId: 'region-3' },
      { row: 4, col: 0, regionId: 'region-4' },
      { row: 4, col: 1, regionId: 'region-4' },
      { row: 5, col: 0, regionId: 'region-4' },
      { row: 5, col: 1, regionId: 'region-4' },
      { row: 4, col: 2, regionId: 'region-5' },
      { row: 4, col: 3, regionId: 'region-5' },
      { row: 5, col: 2, regionId: 'region-5' },
      { row: 5, col: 3, regionId: 'region-5' },
    ],
    regions: [
      { regionId: 'region-0', type: RuleType.SUM_LESS_THAN, value: 12 },
      { regionId: 'region-1', type: RuleType.SUM_EQUALS, value: 12 },
      { regionId: 'region-2', type: RuleType.SUM_LESS_THAN, value: 12 },
      { regionId: 'region-3', type: RuleType.SUM_LESS_THAN, value: 12 },
      { regionId: 'region-4', type: RuleType.SUM_LESS_THAN, value: 12 },
      { regionId: 'region-5', type: RuleType.SUM_EQUALS, value: 12 },
    ],
  },
  // Template 8: Complex T-shape (24 cells)
  {
    rows: 6,
    cols: 5,
    cells: [
      { row: 0, col: 1, regionId: 'region-0' },
      { row: 0, col: 2, regionId: 'region-0' },
      { row: 0, col: 3, regionId: 'region-0' },
      { row: 1, col: 1, regionId: 'region-0' },
      { row: 1, col: 2, regionId: 'region-0' },
      { row: 1, col: 3, regionId: 'region-0' },
      { row: 2, col: 1, regionId: 'region-1' },
      { row: 2, col: 2, regionId: 'region-1' },
      { row: 2, col: 3, regionId: 'region-1' },
      { row: 3, col: 0, regionId: 'region-1' },
      { row: 3, col: 1, regionId: 'region-1' },
      { row: 3, col: 2, regionId: 'region-1' },
      { row: 3, col: 3, regionId: 'region-1' },
      { row: 3, col: 4, regionId: 'region-1' },
      { row: 4, col: 0, regionId: 'region-2' },
      { row: 4, col: 1, regionId: 'region-2' },
      { row: 4, col: 2, regionId: 'region-2' },
      { row: 4, col: 3, regionId: 'region-2' },
      { row: 4, col: 4, regionId: 'region-2' },
      { row: 5, col: 0, regionId: 'region-2' },
      { row: 5, col: 1, regionId: 'region-2' },
      { row: 5, col: 2, regionId: 'region-2' },
      { row: 5, col: 3, regionId: 'region-2' },
      { row: 5, col: 4, regionId: 'region-2' },
    ],
    regions: [
      { regionId: 'region-0', type: RuleType.SUM_LESS_THAN, value: 14 },
      { regionId: 'region-1', type: RuleType.SUM_EQUALS, value: 16 },
      { regionId: 'region-2', type: RuleType.SUM_LESS_THAN, value: 20 },
    ],
  },
  // Template 9: Tetris Z-shape (20 cells)
  {
    rows: 5,
    cols: 5,
    cells: [
      { row: 0, col: 1, regionId: 'region-0' },
      { row: 0, col: 2, regionId: 'region-0' },
      { row: 1, col: 0, regionId: 'region-0' },
      { row: 1, col: 1, regionId: 'region-0' },
      { row: 2, col: 1, regionId: 'region-0' },
      { row: 2, col: 2, regionId: 'region-0' },
      { row: 3, col: 2, regionId: 'region-0' },
      { row: 3, col: 3, regionId: 'region-0' },
      { row: 0, col: 0, regionId: 'region-1' },
      { row: 0, col: 3, regionId: 'region-1' },
      { row: 0, col: 4, regionId: 'region-1' },
      { row: 1, col: 2, regionId: 'region-1' },
      { row: 1, col: 3, regionId: 'region-1' },
      { row: 1, col: 4, regionId: 'region-1' },
      { row: 2, col: 0, regionId: 'region-2' },
      { row: 2, col: 3, regionId: 'region-2' },
      { row: 2, col: 4, regionId: 'region-2' },
      { row: 4, col: 1, regionId: 'region-2' },
      { row: 4, col: 2, regionId: 'region-2' },
      { row: 4, col: 3, regionId: 'region-2' },
    ],
    regions: [
      { regionId: 'region-0', type: RuleType.SUM_LESS_THAN, value: 16 },
      { regionId: 'region-1', type: RuleType.SUM_EQUALS, value: 12 },
      { regionId: 'region-2', type: RuleType.SUM_LESS_THAN, value: 14 },
    ],
  },
  // Template 10: Scattered pattern (22 cells)
  {
    rows: 5,
    cols: 5,
    cells: [
      { row: 0, col: 0, regionId: 'region-0' },
      { row: 0, col: 2, regionId: 'region-0' },
      { row: 0, col: 4, regionId: 'region-0' },
      { row: 1, col: 1, regionId: 'region-0' },
      { row: 1, col: 3, regionId: 'region-0' },
      { row: 2, col: 0, regionId: 'region-1' },
      { row: 2, col: 1, regionId: 'region-1' },
      { row: 2, col: 2, regionId: 'region-1' },
      { row: 2, col: 3, regionId: 'region-1' },
      { row: 2, col: 4, regionId: 'region-1' },
      { row: 3, col: 0, regionId: 'region-2' },
      { row: 3, col: 1, regionId: 'region-2' },
      { row: 3, col: 2, regionId: 'region-2' },
      { row: 3, col: 3, regionId: 'region-2' },
      { row: 3, col: 4, regionId: 'region-2' },
      { row: 4, col: 0, regionId: 'region-3' },
      { row: 4, col: 1, regionId: 'region-3' },
      { row: 4, col: 2, regionId: 'region-3' },
      { row: 4, col: 3, regionId: 'region-3' },
      { row: 4, col: 4, regionId: 'region-3' },
    ],
    regions: [
      { regionId: 'region-0', type: RuleType.SUM_LESS_THAN, value: 12 },
      { regionId: 'region-1', type: RuleType.SUM_EQUALS, value: 15 },
      { regionId: 'region-2', type: RuleType.SUM_LESS_THAN, value: 16 },
      { regionId: 'region-3', type: RuleType.SUM_LESS_THAN, value: 18 },
    ],
  },
];

// Hard templates - most complex shapes, most regions (28-40 cells, 6-10 regions)
export const HARD_TEMPLATES: ShapeTemplate[] = [
  // Template 1: Large letter R (30 cells)
  {
    rows: 6,
    cols: 5,
    cells: [
      { row: 0, col: 0, regionId: 'region-0' },
      { row: 0, col: 1, regionId: 'region-0' },
      { row: 0, col: 2, regionId: 'region-0' },
      { row: 1, col: 0, regionId: 'region-0' },
      { row: 1, col: 2, regionId: 'region-0' },
      { row: 2, col: 0, regionId: 'region-0' },
      { row: 2, col: 1, regionId: 'region-0' },
      { row: 2, col: 2, regionId: 'region-0' },
      { row: 3, col: 0, regionId: 'region-1' },
      { row: 3, col: 1, regionId: 'region-1' },
      { row: 4, col: 0, regionId: 'region-1' },
      { row: 4, col: 1, regionId: 'region-1' },
      { row: 5, col: 0, regionId: 'region-1' },
      { row: 5, col: 1, regionId: 'region-1' },
      { row: 1, col: 1, regionId: 'region-2' },
      { row: 1, col: 3, regionId: 'region-2' },
      { row: 1, col: 4, regionId: 'region-2' },
      { row: 3, col: 2, regionId: 'region-2' },
      { row: 3, col: 3, regionId: 'region-2' },
      { row: 3, col: 4, regionId: 'region-2' },
      { row: 4, col: 2, regionId: 'region-2' },
      { row: 4, col: 3, regionId: 'region-2' },
      { row: 4, col: 4, regionId: 'region-2' },
      { row: 5, col: 2, regionId: 'region-2' },
      { row: 5, col: 3, regionId: 'region-2' },
      { row: 5, col: 4, regionId: 'region-2' },
    ],
    regions: [
      { regionId: 'region-0', type: RuleType.SUM_LESS_THAN, value: 18 },
      { regionId: 'region-1', type: RuleType.SUM_EQUALS, value: 14 },
      { regionId: 'region-2', type: RuleType.SUM_LESS_THAN, value: 20 },
    ],
  },
  // Template 2: Complex Tetris puzzle (32 cells)
  {
    rows: 6,
    cols: 6,
    cells: [
      { row: 0, col: 1, regionId: 'region-0' },
      { row: 0, col: 2, regionId: 'region-0' },
      { row: 0, col: 3, regionId: 'region-0' },
      { row: 1, col: 0, regionId: 'region-0' },
      { row: 1, col: 1, regionId: 'region-0' },
      { row: 1, col: 2, regionId: 'region-0' },
      { row: 2, col: 0, regionId: 'region-1' },
      { row: 2, col: 1, regionId: 'region-1' },
      { row: 2, col: 2, regionId: 'region-1' },
      { row: 3, col: 0, regionId: 'region-1' },
      { row: 3, col: 1, regionId: 'region-1' },
      { row: 1, col: 3, regionId: 'region-2' },
      { row: 1, col: 4, regionId: 'region-2' },
      { row: 2, col: 3, regionId: 'region-2' },
      { row: 2, col: 4, regionId: 'region-2' },
      { row: 3, col: 2, regionId: 'region-3' },
      { row: 3, col: 3, regionId: 'region-3' },
      { row: 3, col: 4, regionId: 'region-3' },
      { row: 4, col: 2, regionId: 'region-3' },
      { row: 4, col: 3, regionId: 'region-3' },
      { row: 4, col: 4, regionId: 'region-3' },
      { row: 0, col: 4, regionId: 'region-4' },
      { row: 0, col: 5, regionId: 'region-4' },
      { row: 4, col: 0, regionId: 'region-4' },
      { row: 4, col: 1, regionId: 'region-4' },
      { row: 5, col: 0, regionId: 'region-4' },
      { row: 5, col: 1, regionId: 'region-4' },
      { row: 5, col: 2, regionId: 'region-4' },
      { row: 5, col: 3, regionId: 'region-4' },
      { row: 5, col: 4, regionId: 'region-4' },
      { row: 5, col: 5, regionId: 'region-4' },
    ],
    regions: [
      { regionId: 'region-0', type: RuleType.SUM_LESS_THAN, value: 16 },
      { regionId: 'region-1', type: RuleType.SUM_EQUALS, value: 14 },
      { regionId: 'region-2', type: RuleType.SUM_LESS_THAN, value: 12 },
      { regionId: 'region-3', type: RuleType.SUM_LESS_THAN, value: 16 },
      { regionId: 'region-4', type: RuleType.SUM_LESS_THAN, value: 20 },
    ],
  },
  // Template 3: Large interlocking (34 cells)
  {
    rows: 6,
    cols: 6,
    cells: [
      { row: 0, col: 0, regionId: 'region-0' },
      { row: 0, col: 1, regionId: 'region-0' },
      { row: 1, col: 0, regionId: 'region-0' },
      { row: 1, col: 1, regionId: 'region-0' },
      { row: 2, col: 0, regionId: 'region-0' },
      { row: 0, col: 2, regionId: 'region-1' },
      { row: 0, col: 3, regionId: 'region-1' },
      { row: 1, col: 2, regionId: 'region-1' },
      { row: 1, col: 3, regionId: 'region-1' },
      { row: 2, col: 2, regionId: 'region-1' },
      { row: 2, col: 3, regionId: 'region-1' },
      { row: 0, col: 4, regionId: 'region-2' },
      { row: 0, col: 5, regionId: 'region-2' },
      { row: 1, col: 4, regionId: 'region-2' },
      { row: 1, col: 5, regionId: 'region-2' },
      { row: 2, col: 1, regionId: 'region-3' },
      { row: 2, col: 4, regionId: 'region-3' },
      { row: 2, col: 5, regionId: 'region-3' },
      { row: 3, col: 1, regionId: 'region-4' },
      { row: 3, col: 2, regionId: 'region-4' },
      { row: 3, col: 3, regionId: 'region-4' },
      { row: 4, col: 1, regionId: 'region-4' },
      { row: 4, col: 2, regionId: 'region-4' },
      { row: 4, col: 3, regionId: 'region-4' },
      { row: 3, col: 4, regionId: 'region-5' },
      { row: 3, col: 5, regionId: 'region-5' },
      { row: 4, col: 4, regionId: 'region-5' },
      { row: 4, col: 5, regionId: 'region-5' },
      { row: 5, col: 1, regionId: 'region-5' },
      { row: 5, col: 2, regionId: 'region-5' },
      { row: 5, col: 3, regionId: 'region-5' },
      { row: 5, col: 4, regionId: 'region-5' },
      { row: 5, col: 5, regionId: 'region-5' },
    ],
    regions: [
      { regionId: 'region-0', type: RuleType.SUM_LESS_THAN, value: 12 },
      { regionId: 'region-1', type: RuleType.SUM_EQUALS, value: 14 },
      { regionId: 'region-2', type: RuleType.SUM_LESS_THAN, value: 12 },
      { regionId: 'region-3', type: RuleType.SUM_LESS_THAN, value: 10 },
      { regionId: 'region-4', type: RuleType.SUM_LESS_THAN, value: 16 },
      { regionId: 'region-5', type: RuleType.SUM_LESS_THAN, value: 22 },
    ],
  },
  // Template 4: Sparse pattern (36 cells)
  {
    rows: 7,
    cols: 6,
    cells: [
      { row: 0, col: 1, regionId: 'region-0' },
      { row: 0, col: 2, regionId: 'region-0' },
      { row: 0, col: 3, regionId: 'region-0' },
      { row: 0, col: 4, regionId: 'region-0' },
      { row: 1, col: 0, regionId: 'region-1' },
      { row: 1, col: 1, regionId: 'region-1' },
      { row: 1, col: 2, regionId: 'region-1' },
      { row: 1, col: 3, regionId: 'region-1' },
      { row: 2, col: 1, regionId: 'region-2' },
      { row: 2, col: 2, regionId: 'region-2' },
      { row: 2, col: 3, regionId: 'region-2' },
      { row: 2, col: 4, regionId: 'region-2' },
      { row: 3, col: 0, regionId: 'region-3' },
      { row: 3, col: 1, regionId: 'region-3' },
      { row: 3, col: 2, regionId: 'region-3' },
      { row: 3, col: 3, regionId: 'region-3' },
      { row: 4, col: 1, regionId: 'region-4' },
      { row: 4, col: 2, regionId: 'region-4' },
      { row: 4, col: 3, regionId: 'region-4' },
      { row: 4, col: 4, regionId: 'region-4' },
      { row: 5, col: 0, regionId: 'region-5' },
      { row: 5, col: 1, regionId: 'region-5' },
      { row: 5, col: 2, regionId: 'region-5' },
      { row: 5, col: 3, regionId: 'region-5' },
      { row: 6, col: 1, regionId: 'region-6' },
      { row: 6, col: 2, regionId: 'region-6' },
      { row: 6, col: 3, regionId: 'region-6' },
      { row: 6, col: 4, regionId: 'region-6' },
    ],
    regions: [
      { regionId: 'region-0', type: RuleType.SUM_LESS_THAN, value: 12 },
      { regionId: 'region-1', type: RuleType.SUM_EQUALS, value: 12 },
      { regionId: 'region-2', type: RuleType.SUM_LESS_THAN, value: 12 },
      { regionId: 'region-3', type: RuleType.SUM_LESS_THAN, value: 12 },
      { regionId: 'region-4', type: RuleType.SUM_LESS_THAN, value: 12 },
      { regionId: 'region-5', type: RuleType.SUM_LESS_THAN, value: 12 },
      { regionId: 'region-6', type: RuleType.SUM_EQUALS, value: 12 },
    ],
  },
  // Template 5: Complex letter shape (38 cells)
  {
    rows: 7,
    cols: 6,
    cells: [
      { row: 0, col: 0, regionId: 'region-0' },
      { row: 0, col: 1, regionId: 'region-0' },
      { row: 0, col: 2, regionId: 'region-0' },
      { row: 0, col: 3, regionId: 'region-0' },
      { row: 1, col: 0, regionId: 'region-0' },
      { row: 1, col: 3, regionId: 'region-0' },
      { row: 2, col: 0, regionId: 'region-1' },
      { row: 2, col: 1, regionId: 'region-1' },
      { row: 2, col: 2, regionId: 'region-1' },
      { row: 2, col: 3, regionId: 'region-1' },
      { row: 3, col: 0, regionId: 'region-2' },
      { row: 3, col: 1, regionId: 'region-2' },
      { row: 4, col: 0, regionId: 'region-2' },
      { row: 4, col: 1, regionId: 'region-2' },
      { row: 5, col: 0, regionId: 'region-2' },
      { row: 5, col: 1, regionId: 'region-2' },
      { row: 1, col: 1, regionId: 'region-3' },
      { row: 1, col: 2, regionId: 'region-3' },
      { row: 3, col: 2, regionId: 'region-3' },
      { row: 3, col: 3, regionId: 'region-3' },
      { row: 3, col: 4, regionId: 'region-3' },
      { row: 4, col: 2, regionId: 'region-3' },
      { row: 4, col: 3, regionId: 'region-3' },
      { row: 4, col: 4, regionId: 'region-3' },
      { row: 5, col: 2, regionId: 'region-4' },
      { row: 5, col: 3, regionId: 'region-4' },
      { row: 5, col: 4, regionId: 'region-4' },
      { row: 6, col: 2, regionId: 'region-4' },
      { row: 6, col: 3, regionId: 'region-4' },
      { row: 6, col: 4, regionId: 'region-4' },
    ],
    regions: [
      { regionId: 'region-0', type: RuleType.SUM_LESS_THAN, value: 14 },
      { regionId: 'region-1', type: RuleType.SUM_EQUALS, value: 12 },
      { regionId: 'region-2', type: RuleType.SUM_LESS_THAN, value: 16 },
      { regionId: 'region-3', type: RuleType.SUM_LESS_THAN, value: 18 },
      { regionId: 'region-4', type: RuleType.SUM_LESS_THAN, value: 16 },
    ],
  },
  // Template 6: Large scattered (40 cells)
  {
    rows: 7,
    cols: 6,
    cells: [
      { row: 0, col: 0, regionId: 'region-0' },
      { row: 0, col: 1, regionId: 'region-0' },
      { row: 0, col: 2, regionId: 'region-0' },
      { row: 1, col: 0, regionId: 'region-0' },
      { row: 1, col: 1, regionId: 'region-0' },
      { row: 0, col: 4, regionId: 'region-1' },
      { row: 0, col: 5, regionId: 'region-1' },
      { row: 1, col: 4, regionId: 'region-1' },
      { row: 1, col: 5, regionId: 'region-1' },
      { row: 2, col: 1, regionId: 'region-2' },
      { row: 2, col: 2, regionId: 'region-2' },
      { row: 2, col: 3, regionId: 'region-2' },
      { row: 3, col: 1, regionId: 'region-2' },
      { row: 3, col: 2, regionId: 'region-2' },
      { row: 3, col: 3, regionId: 'region-2' },
      { row: 2, col: 4, regionId: 'region-3' },
      { row: 2, col: 5, regionId: 'region-3' },
      { row: 3, col: 4, regionId: 'region-3' },
      { row: 3, col: 5, regionId: 'region-3' },
      { row: 4, col: 0, regionId: 'region-4' },
      { row: 4, col: 1, regionId: 'region-4' },
      { row: 4, col: 2, regionId: 'region-4' },
      { row: 5, col: 0, regionId: 'region-4' },
      { row: 5, col: 1, regionId: 'region-4' },
      { row: 5, col: 2, regionId: 'region-4' },
      { row: 4, col: 3, regionId: 'region-5' },
      { row: 4, col: 4, regionId: 'region-5' },
      { row: 4, col: 5, regionId: 'region-5' },
      { row: 5, col: 3, regionId: 'region-5' },
      { row: 5, col: 4, regionId: 'region-5' },
      { row: 5, col: 5, regionId: 'region-5' },
      { row: 6, col: 0, regionId: 'region-6' },
      { row: 6, col: 1, regionId: 'region-6' },
      { row: 6, col: 2, regionId: 'region-6' },
      { row: 6, col: 3, regionId: 'region-6' },
      { row: 6, col: 4, regionId: 'region-6' },
      { row: 6, col: 5, regionId: 'region-6' },
    ],
    regions: [
      { regionId: 'region-0', type: RuleType.SUM_LESS_THAN, value: 12 },
      { regionId: 'region-1', type: RuleType.SUM_EQUALS, value: 12 },
      { regionId: 'region-2', type: RuleType.SUM_LESS_THAN, value: 16 },
      { regionId: 'region-3', type: RuleType.SUM_LESS_THAN, value: 12 },
      { regionId: 'region-4', type: RuleType.SUM_LESS_THAN, value: 16 },
      { regionId: 'region-5', type: RuleType.SUM_LESS_THAN, value: 16 },
      { regionId: 'region-6', type: RuleType.SUM_EQUALS, value: 18 },
    ],
  },
  // Template 7: Multiple interlocking (40 cells)
  {
    rows: 7,
    cols: 6,
    cells: [
      { row: 0, col: 0, regionId: 'region-0' },
      { row: 0, col: 1, regionId: 'region-0' },
      { row: 1, col: 0, regionId: 'region-0' },
      { row: 1, col: 1, regionId: 'region-0' },
      { row: 2, col: 0, regionId: 'region-0' },
      { row: 0, col: 2, regionId: 'region-1' },
      { row: 0, col: 3, regionId: 'region-1' },
      { row: 1, col: 2, regionId: 'region-1' },
      { row: 1, col: 3, regionId: 'region-1' },
      { row: 2, col: 2, regionId: 'region-1' },
      { row: 2, col: 3, regionId: 'region-1' },
      { row: 0, col: 4, regionId: 'region-2' },
      { row: 0, col: 5, regionId: 'region-2' },
      { row: 1, col: 4, regionId: 'region-2' },
      { row: 1, col: 5, regionId: 'region-2' },
      { row: 2, col: 1, regionId: 'region-3' },
      { row: 2, col: 4, regionId: 'region-3' },
      { row: 2, col: 5, regionId: 'region-3' },
      { row: 3, col: 0, regionId: 'region-4' },
      { row: 3, col: 1, regionId: 'region-4' },
      { row: 3, col: 2, regionId: 'region-4' },
      { row: 4, col: 0, regionId: 'region-4' },
      { row: 4, col: 1, regionId: 'region-4' },
      { row: 4, col: 2, regionId: 'region-4' },
      { row: 3, col: 3, regionId: 'region-5' },
      { row: 3, col: 4, regionId: 'region-5' },
      { row: 3, col: 5, regionId: 'region-5' },
      { row: 4, col: 3, regionId: 'region-5' },
      { row: 4, col: 4, regionId: 'region-5' },
      { row: 4, col: 5, regionId: 'region-5' },
      { row: 5, col: 0, regionId: 'region-6' },
      { row: 5, col: 1, regionId: 'region-6' },
      { row: 5, col: 2, regionId: 'region-6' },
      { row: 5, col: 3, regionId: 'region-6' },
      { row: 5, col: 4, regionId: 'region-6' },
      { row: 5, col: 5, regionId: 'region-6' },
      { row: 6, col: 0, regionId: 'region-7' },
      { row: 6, col: 1, regionId: 'region-7' },
      { row: 6, col: 2, regionId: 'region-7' },
      { row: 6, col: 3, regionId: 'region-7' },
      { row: 6, col: 4, regionId: 'region-7' },
      { row: 6, col: 5, regionId: 'region-7' },
    ],
    regions: [
      { regionId: 'region-0', type: RuleType.SUM_LESS_THAN, value: 12 },
      { regionId: 'region-1', type: RuleType.SUM_EQUALS, value: 14 },
      { regionId: 'region-2', type: RuleType.SUM_LESS_THAN, value: 12 },
      { regionId: 'region-3', type: RuleType.SUM_LESS_THAN, value: 10 },
      { regionId: 'region-4', type: RuleType.SUM_LESS_THAN, value: 16 },
      { regionId: 'region-5', type: RuleType.SUM_LESS_THAN, value: 16 },
      { regionId: 'region-6', type: RuleType.SUM_EQUALS, value: 18 },
      { regionId: 'region-7', type: RuleType.SUM_EQUALS, value: 18 },
    ],
  },
  // Template 8: Complex pattern (40 cells)
  {
    rows: 7,
    cols: 6,
    cells: [
      { row: 0, col: 1, regionId: 'region-0' },
      { row: 0, col: 2, regionId: 'region-0' },
      { row: 0, col: 3, regionId: 'region-0' },
      { row: 0, col: 4, regionId: 'region-0' },
      { row: 1, col: 0, regionId: 'region-1' },
      { row: 1, col: 1, regionId: 'region-1' },
      { row: 1, col: 2, regionId: 'region-1' },
      { row: 1, col: 3, regionId: 'region-1' },
      { row: 2, col: 0, regionId: 'region-2' },
      { row: 2, col: 1, regionId: 'region-2' },
      { row: 2, col: 2, regionId: 'region-2' },
      { row: 2, col: 3, regionId: 'region-2' },
      { row: 3, col: 0, regionId: 'region-3' },
      { row: 3, col: 1, regionId: 'region-3' },
      { row: 3, col: 2, regionId: 'region-3' },
      { row: 3, col: 3, regionId: 'region-3' },
      { row: 4, col: 0, regionId: 'region-4' },
      { row: 4, col: 1, regionId: 'region-4' },
      { row: 4, col: 2, regionId: 'region-4' },
      { row: 4, col: 3, regionId: 'region-4' },
      { row: 1, col: 4, regionId: 'region-5' },
      { row: 1, col: 5, regionId: 'region-5' },
      { row: 2, col: 4, regionId: 'region-5' },
      { row: 2, col: 5, regionId: 'region-5' },
      { row: 3, col: 4, regionId: 'region-6' },
      { row: 3, col: 5, regionId: 'region-6' },
      { row: 4, col: 4, regionId: 'region-6' },
      { row: 4, col: 5, regionId: 'region-6' },
      { row: 5, col: 0, regionId: 'region-7' },
      { row: 5, col: 1, regionId: 'region-7' },
      { row: 5, col: 2, regionId: 'region-7' },
      { row: 5, col: 3, regionId: 'region-7' },
      { row: 5, col: 4, regionId: 'region-7' },
      { row: 5, col: 5, regionId: 'region-7' },
      { row: 6, col: 0, regionId: 'region-8' },
      { row: 6, col: 1, regionId: 'region-8' },
      { row: 6, col: 2, regionId: 'region-8' },
      { row: 6, col: 3, regionId: 'region-8' },
      { row: 6, col: 4, regionId: 'region-8' },
      { row: 6, col: 5, regionId: 'region-8' },
    ],
    regions: [
      { regionId: 'region-0', type: RuleType.SUM_LESS_THAN, value: 12 },
      { regionId: 'region-1', type: RuleType.SUM_EQUALS, value: 12 },
      { regionId: 'region-2', type: RuleType.SUM_LESS_THAN, value: 12 },
      { regionId: 'region-3', type: RuleType.SUM_LESS_THAN, value: 12 },
      { regionId: 'region-4', type: RuleType.SUM_LESS_THAN, value: 12 },
      { regionId: 'region-5', type: RuleType.SUM_LESS_THAN, value: 12 },
      { regionId: 'region-6', type: RuleType.SUM_LESS_THAN, value: 12 },
      { regionId: 'region-7', type: RuleType.SUM_EQUALS, value: 18 },
      { regionId: 'region-8', type: RuleType.SUM_EQUALS, value: 18 },
    ],
  },
];

// Track template failures to avoid repeatedly trying impossible templates
const templateFailureCount = new Map<string, number>();
const MAX_TEMPLATE_FAILURES = 1; // Skip template after 1 failure (aggressive - fail fast on impossible templates)
const globalFailureResetCount = new Map<string, number>(); // Track how many times we've reset for a difficulty
const MAX_GLOBAL_RESETS = 2; // Prevent infinite reset loops
const failedTemplateDetails = new Map<string, { cellCount: number; regionCount: number; difficulty: string }>(); // Track details of failed templates

// Helper function to get template key for tracking
function getTemplateKey(template: ShapeTemplate, difficulty: 'easy' | 'medium' | 'hard'): string {
  // Create a unique key based on template structure
  const cellsKey = template.cells
    .map(c => `${c.row},${c.col},${c.regionId}`)
    .sort()
    .join('|');
  const regionsKey = template.regions
    .map(r => `${r.regionId}:${r.type}:${r.value}`)
    .sort()
    .join('|');
  return `${difficulty}:${cellsKey}:${regionsKey}`;
}

// Mark a template as failed
export function markTemplateFailed(template: ShapeTemplate, difficulty: 'easy' | 'medium' | 'hard'): void {
  const key = getTemplateKey(template, difficulty);
  const current = templateFailureCount.get(key) || 0;
  templateFailureCount.set(key, current + 1);
  
  // Store details for debugging
  if (current === 0) { // Only log on first failure
    failedTemplateDetails.set(key, {
      cellCount: template.cells.length,
      regionCount: template.regions.length,
      difficulty,
    });
    console.warn(`Template marked as failed: ${difficulty} difficulty, ${template.cells.length} cells, ${template.regions.length} regions`);
  }
}

// Get list of failed templates for debugging
export function getFailedTemplates(): Array<{ difficulty: string; cellCount: number; regionCount: number }> {
  return Array.from(failedTemplateDetails.values());
}

// Check if a template should be skipped
function shouldSkipTemplate(template: ShapeTemplate, difficulty: 'easy' | 'medium' | 'hard'): boolean {
  // Skip templates with odd number of cells (impossible to tile with dominoes)
  if (template.cells.length % 2 !== 0) {
    return true;
  }
  
  const key = getTemplateKey(template, difficulty);
  const failures = templateFailureCount.get(key) || 0;
  return failures >= MAX_TEMPLATE_FAILURES;
}

// Get available templates (excluding failed ones)
function getAvailableTemplates(difficulty: 'easy' | 'medium' | 'hard'): ShapeTemplate[] {
  const templates = 
    difficulty === 'easy' ? EASY_TEMPLATES :
    difficulty === 'medium' ? MEDIUM_TEMPLATES :
    HARD_TEMPLATES;
  
  return templates.filter(t => !shouldSkipTemplate(t, difficulty));
}

// Guaranteed-to-work simple template (always has even cells, simple structure)
// This is used as a last resort when all other templates fail
const FALLBACK_TEMPLATE: ShapeTemplate = {
  rows: 4,
  cols: 4,
  cells: [
    { row: 0, col: 0, regionId: 'region-0' }, { row: 0, col: 1, regionId: 'region-0' },
    { row: 1, col: 0, regionId: 'region-0' }, { row: 1, col: 1, regionId: 'region-0' },
    { row: 0, col: 2, regionId: 'region-1' }, { row: 0, col: 3, regionId: 'region-1' },
    { row: 1, col: 2, regionId: 'region-1' }, { row: 1, col: 3, regionId: 'region-1' },
    { row: 2, col: 0, regionId: 'region-2' }, { row: 2, col: 1, regionId: 'region-2' },
    { row: 3, col: 0, regionId: 'region-2' }, { row: 3, col: 1, regionId: 'region-2' },
    { row: 2, col: 2, regionId: 'region-3' }, { row: 2, col: 3, regionId: 'region-3' },
    { row: 3, col: 2, regionId: 'region-3' }, { row: 3, col: 3, regionId: 'region-3' },
  ],
  regions: [
    { regionId: 'region-0', type: RuleType.SUM_LESS_THAN, value: 20 },
    { regionId: 'region-1', type: RuleType.SUM_LESS_THAN, value: 20 },
    { regionId: 'region-2', type: RuleType.SUM_LESS_THAN, value: 20 },
    { regionId: 'region-3', type: RuleType.SUM_LESS_THAN, value: 20 },
  ],
};

// Helper function to get a random template for a difficulty
export function getRandomTemplate(
  difficulty: 'easy' | 'medium' | 'hard',
  random: { randomInt: (min: number, max: number) => number }
): ShapeTemplate {
  const availableTemplates = getAvailableTemplates(difficulty);
  
  // If all templates are filtered out, use guaranteed fallback template
  if (availableTemplates.length === 0) {
    const resetCount = globalFailureResetCount.get(difficulty) || 0;
    
    if (resetCount >= MAX_GLOBAL_RESETS) {
      // Too many resets - use guaranteed fallback template
      console.warn(`All ${difficulty} templates filtered out after ${resetCount} resets. Using fallback template.`);
      templateFailureCount.clear();
      globalFailureResetCount.delete(difficulty);
      return FALLBACK_TEMPLATE;
    }
    
    // Reset failure counts and try again once
    console.warn(`All ${difficulty} templates filtered out (reset ${resetCount + 1}/${MAX_GLOBAL_RESETS}), resetting failure counts`);
    templateFailureCount.clear();
    globalFailureResetCount.set(difficulty, resetCount + 1);
    
    // Try again with cleared failures
    const retryTemplates = getAvailableTemplates(difficulty);
    if (retryTemplates.length > 0) {
      const index = random.randomInt(0, retryTemplates.length - 1);
      return retryTemplates[index];
    }
    
    // Still no templates? Use guaranteed fallback
    return FALLBACK_TEMPLATE;
  }
  
  const index = random.randomInt(0, availableTemplates.length - 1);
  return availableTemplates[index];
}
