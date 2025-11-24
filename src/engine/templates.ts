import type { RegionRule } from '../types/puzzle';
import { RuleType } from '../types/puzzle';

export type ShapeTemplate = {
  rows: number;
  cols: number;
  cells: { row: number; col: number; regionId: string }[];
  regions: RegionRule[];
};

// Easy templates - simpler shapes, fewer regions
export const EASY_TEMPLATES: ShapeTemplate[] = [
  // Template 1: L-shape with small island
  {
    rows: 5,
    cols: 5,
    cells: [
      // Orange L-shape (region-0)
      { row: 0, col: 0, regionId: 'region-0' },
      { row: 0, col: 1, regionId: 'region-0' },
      { row: 0, col: 2, regionId: 'region-0' },
      { row: 1, col: 0, regionId: 'region-0' },
      { row: 2, col: 0, regionId: 'region-0' },
      // Purple block (region-1)
      { row: 1, col: 2, regionId: 'region-1' },
      { row: 1, col: 3, regionId: 'region-1' },
      { row: 2, col: 2, regionId: 'region-1' },
      { row: 2, col: 3, regionId: 'region-1' },
      // Green island (region-2)
      { row: 3, col: 1, regionId: 'region-2' },
      { row: 3, col: 2, regionId: 'region-2' },
      { row: 4, col: 1, regionId: 'region-2' },
      { row: 4, col: 2, regionId: 'region-2' },
      // Blue block (region-3)
      { row: 0, col: 3, regionId: 'region-3' },
      { row: 0, col: 4, regionId: 'region-3' },
      { row: 1, col: 4, regionId: 'region-3' },
    ],
    regions: [
      { regionId: 'region-0', type: RuleType.SUM_AT_LEAST, value: 8 },
      { regionId: 'region-1', type: RuleType.SUM_AT_MOST, value: 12 },
      { regionId: 'region-2', type: RuleType.SUM_AT_LEAST, value: 10 },
      { regionId: 'region-3', type: RuleType.SUM_AT_MOST, value: 14 },
    ],
  },
  // Template 2: T-shape with gaps
  {
    rows: 5,
    cols: 5,
    cells: [
      // Orange T-shape (region-0)
      { row: 0, col: 1, regionId: 'region-0' },
      { row: 0, col: 2, regionId: 'region-0' },
      { row: 0, col: 3, regionId: 'region-0' },
      { row: 1, col: 2, regionId: 'region-0' },
      { row: 2, col: 2, regionId: 'region-0' },
      // Purple L (region-1)
      { row: 2, col: 0, regionId: 'region-1' },
      { row: 2, col: 1, regionId: 'region-1' },
      { row: 3, col: 0, regionId: 'region-1' },
      { row: 4, col: 0, regionId: 'region-1' },
      // Green block (region-2)
      { row: 3, col: 2, regionId: 'region-2' },
      { row: 3, col: 3, regionId: 'region-2' },
      { row: 4, col: 2, regionId: 'region-2' },
      { row: 4, col: 3, regionId: 'region-2' },
      // Blue corner (region-3)
      { row: 1, col: 0, regionId: 'region-3' },
      { row: 2, col: 3, regionId: 'region-3' },
      { row: 2, col: 4, regionId: 'region-3' },
      { row: 3, col: 4, regionId: 'region-3' },
    ],
    regions: [
      { regionId: 'region-0', type: RuleType.SUM_AT_LEAST, value: 9 },
      { regionId: 'region-1', type: RuleType.SUM_AT_MOST, value: 11 },
      { regionId: 'region-2', type: RuleType.SUM_AT_LEAST, value: 10 },
      { regionId: 'region-3', type: RuleType.SUM_AT_MOST, value: 13 },
    ],
  },
  // Template 3: Scattered islands
  {
    rows: 5,
    cols: 5,
    cells: [
      // Orange island (region-0)
      { row: 0, col: 0, regionId: 'region-0' },
      { row: 0, col: 1, regionId: 'region-0' },
      { row: 1, col: 0, regionId: 'region-0' },
      // Purple L (region-1)
      { row: 0, col: 3, regionId: 'region-1' },
      { row: 0, col: 4, regionId: 'region-1' },
      { row: 1, col: 4, regionId: 'region-1' },
      { row: 2, col: 4, regionId: 'region-1' },
      // Green block (region-2)
      { row: 2, col: 0, regionId: 'region-2' },
      { row: 2, col: 1, regionId: 'region-2' },
      { row: 3, col: 0, regionId: 'region-2' },
      { row: 3, col: 1, regionId: 'region-2' },
      // Blue scattered (region-3)
      { row: 1, col: 2, regionId: 'region-3' },
      { row: 2, col: 2, regionId: 'region-3' },
      { row: 3, col: 2, regionId: 'region-3' },
      { row: 3, col: 3, regionId: 'region-3' },
      { row: 4, col: 3, regionId: 'region-3' },
    ],
    regions: [
      { regionId: 'region-0', type: RuleType.SUM_AT_LEAST, value: 7 },
      { regionId: 'region-1', type: RuleType.SUM_AT_MOST, value: 12 },
      { regionId: 'region-2', type: RuleType.SUM_AT_LEAST, value: 9 },
      { regionId: 'region-3', type: RuleType.SUM_AT_MOST, value: 15 },
    ],
  },
  // Template 4: Snake shape
  {
    rows: 5,
    cols: 5,
    cells: [
      // Orange snake (region-0)
      { row: 0, col: 0, regionId: 'region-0' },
      { row: 0, col: 1, regionId: 'region-0' },
      { row: 1, col: 1, regionId: 'region-0' },
      { row: 1, col: 2, regionId: 'region-0' },
      // Purple block (region-1)
      { row: 0, col: 3, regionId: 'region-1' },
      { row: 0, col: 4, regionId: 'region-1' },
      { row: 1, col: 3, regionId: 'region-1' },
      { row: 1, col: 4, regionId: 'region-1' },
      // Green L (region-2)
      { row: 2, col: 0, regionId: 'region-2' },
      { row: 3, col: 0, regionId: 'region-2' },
      { row: 3, col: 1, regionId: 'region-2' },
      { row: 4, col: 1, regionId: 'region-2' },
      // Blue scattered (region-3)
      { row: 2, col: 2, regionId: 'region-3' },
      { row: 2, col: 3, regionId: 'region-3' },
      { row: 3, col: 2, regionId: 'region-3' },
      { row: 3, col: 3, regionId: 'region-3' },
      { row: 4, col: 3, regionId: 'region-3' },
    ],
    regions: [
      { regionId: 'region-0', type: RuleType.SUM_AT_LEAST, value: 8 },
      { regionId: 'region-1', type: RuleType.SUM_AT_MOST, value: 11 },
      { regionId: 'region-2', type: RuleType.SUM_AT_LEAST, value: 9 },
      { regionId: 'region-3', type: RuleType.SUM_AT_MOST, value: 14 },
    ],
  },
  // Template 5: Cross shape
  {
    rows: 5,
    cols: 5,
    cells: [
      // Orange cross (region-0)
      { row: 0, col: 2, regionId: 'region-0' },
      { row: 1, col: 1, regionId: 'region-0' },
      { row: 1, col: 2, regionId: 'region-0' },
      { row: 1, col: 3, regionId: 'region-0' },
      { row: 2, col: 2, regionId: 'region-0' },
      // Purple corners (region-1)
      { row: 0, col: 0, regionId: 'region-1' },
      { row: 0, col: 1, regionId: 'region-1' },
      { row: 1, col: 0, regionId: 'region-1' },
      // Green corners (region-2)
      { row: 0, col: 3, regionId: 'region-2' },
      { row: 0, col: 4, regionId: 'region-2' },
      { row: 1, col: 4, regionId: 'region-2' },
      // Blue bottom (region-3)
      { row: 2, col: 0, regionId: 'region-3' },
      { row: 2, col: 1, regionId: 'region-3' },
      { row: 3, col: 0, regionId: 'region-3' },
      { row: 3, col: 1, regionId: 'region-3' },
      { row: 4, col: 1, regionId: 'region-3' },
      { row: 4, col: 2, regionId: 'region-3' },
      { row: 4, col: 3, regionId: 'region-3' },
    ],
    regions: [
      { regionId: 'region-0', type: RuleType.SUM_AT_LEAST, value: 10 },
      { regionId: 'region-1', type: RuleType.SUM_AT_MOST, value: 9 },
      { regionId: 'region-2', type: RuleType.SUM_AT_LEAST, value: 8 },
      { regionId: 'region-3', type: RuleType.SUM_AT_MOST, value: 16 },
    ],
  },
];

// Medium templates - more complex shapes, more regions
export const MEDIUM_TEMPLATES: ShapeTemplate[] = [
  // Template 1: Complex L-shapes
  {
    rows: 6,
    cols: 6,
    cells: [
      // Orange large L (region-0)
      { row: 0, col: 0, regionId: 'region-0' },
      { row: 0, col: 1, regionId: 'region-0' },
      { row: 0, col: 2, regionId: 'region-0' },
      { row: 1, col: 0, regionId: 'region-0' },
      { row: 2, col: 0, regionId: 'region-0' },
      { row: 3, col: 0, regionId: 'region-0' },
      // Purple block (region-1)
      { row: 1, col: 2, regionId: 'region-1' },
      { row: 1, col: 3, regionId: 'region-1' },
      { row: 2, col: 2, regionId: 'region-1' },
      { row: 2, col: 3, regionId: 'region-1' },
      // Green island (region-2)
      { row: 0, col: 4, regionId: 'region-2' },
      { row: 0, col: 5, regionId: 'region-2' },
      { row: 1, col: 4, regionId: 'region-2' },
      // Blue scattered (region-3)
      { row: 3, col: 2, regionId: 'region-3' },
      { row: 3, col: 3, regionId: 'region-3' },
      { row: 4, col: 2, regionId: 'region-3' },
      // Pink L (region-4)
      { row: 4, col: 0, regionId: 'region-4' },
      { row: 4, col: 1, regionId: 'region-4' },
      { row: 5, col: 1, regionId: 'region-4' },
      { row: 5, col: 2, regionId: 'region-4' },
      // Teal block (region-5)
      { row: 2, col: 4, regionId: 'region-5' },
      { row: 2, col: 5, regionId: 'region-5' },
      { row: 3, col: 4, regionId: 'region-5' },
      { row: 3, col: 5, regionId: 'region-5' },
      { row: 4, col: 4, regionId: 'region-5' },
      { row: 4, col: 5, regionId: 'region-5' },
      { row: 5, col: 4, regionId: 'region-5' },
      { row: 5, col: 5, regionId: 'region-5' },
    ],
    regions: [
      { regionId: 'region-0', type: RuleType.SUM_AT_LEAST, value: 12 },
      { regionId: 'region-1', type: RuleType.SUM_AT_MOST, value: 14 },
      { regionId: 'region-2', type: RuleType.VALUES_EQUAL, value: 0 },
      { regionId: 'region-3', type: RuleType.SUM_AT_LEAST, value: 9 },
      { regionId: 'region-4', type: RuleType.SUM_AT_MOST, value: 11 },
      { regionId: 'region-5', type: RuleType.SUM_AT_LEAST, value: 18 },
    ],
  },
  // Template 2: Multiple islands
  {
    rows: 6,
    cols: 6,
    cells: [
      // Orange island (region-0)
      { row: 0, col: 0, regionId: 'region-0' },
      { row: 0, col: 1, regionId: 'region-0' },
      { row: 1, col: 0, regionId: 'region-0' },
      { row: 1, col: 1, regionId: 'region-0' },
      // Purple L (region-1)
      { row: 0, col: 3, regionId: 'region-1' },
      { row: 0, col: 4, regionId: 'region-1' },
      { row: 1, col: 3, regionId: 'region-1' },
      { row: 2, col: 3, regionId: 'region-1' },
      // Green scattered (region-2)
      { row: 2, col: 0, regionId: 'region-2' },
      { row: 2, col: 1, regionId: 'region-2' },
      { row: 3, col: 0, regionId: 'region-2' },
      { row: 3, col: 1, regionId: 'region-2' },
      { row: 4, col: 0, regionId: 'region-2' },
      // Blue block (region-3)
      { row: 1, col: 5, regionId: 'region-3' },
      { row: 2, col: 5, regionId: 'region-3' },
      { row: 3, col: 5, regionId: 'region-3' },
      // Pink snake (region-4)
      { row: 3, col: 2, regionId: 'region-4' },
      { row: 3, col: 3, regionId: 'region-4' },
      { row: 4, col: 2, regionId: 'region-4' },
      { row: 4, col: 3, regionId: 'region-4' },
      { row: 5, col: 2, regionId: 'region-4' },
      { row: 5, col: 3, regionId: 'region-4' },
      // Teal corner (region-5)
      { row: 4, col: 4, regionId: 'region-5' },
      { row: 4, col: 5, regionId: 'region-5' },
      { row: 5, col: 4, regionId: 'region-5' },
      { row: 5, col: 5, regionId: 'region-5' },
    ],
    regions: [
      { regionId: 'region-0', type: RuleType.SUM_AT_LEAST, value: 10 },
      { regionId: 'region-1', type: RuleType.SUM_AT_MOST, value: 12 },
      { regionId: 'region-2', type: RuleType.SUM_AT_LEAST, value: 13 },
      { regionId: 'region-3', type: RuleType.VALUES_ALL_DIFFERENT, value: 0 },
      { regionId: 'region-4', type: RuleType.SUM_AT_MOST, value: 15 },
      { regionId: 'region-5', type: RuleType.SUM_AT_LEAST, value: 11 },
    ],
  },
  // Template 3: Zigzag pattern
  {
    rows: 6,
    cols: 6,
    cells: [
      // Orange zigzag (region-0)
      { row: 0, col: 0, regionId: 'region-0' },
      { row: 0, col: 1, regionId: 'region-0' },
      { row: 1, col: 1, regionId: 'region-0' },
      { row: 1, col: 2, regionId: 'region-0' },
      { row: 2, col: 2, regionId: 'region-0' },
      // Purple block (region-1)
      { row: 0, col: 3, regionId: 'region-1' },
      { row: 0, col: 4, regionId: 'region-1' },
      { row: 1, col: 3, regionId: 'region-1' },
      { row: 1, col: 4, regionId: 'region-1' },
      // Green L (region-2)
      { row: 2, col: 0, regionId: 'region-2' },
      { row: 3, col: 0, regionId: 'region-2' },
      { row: 3, col: 1, regionId: 'region-2' },
      { row: 4, col: 1, regionId: 'region-2' },
      // Blue scattered (region-3)
      { row: 2, col: 4, regionId: 'region-3' },
      { row: 2, col: 5, regionId: 'region-3' },
      { row: 3, col: 4, regionId: 'region-3' },
      { row: 3, col: 5, regionId: 'region-3' },
      // Pink island (region-4)
      { row: 4, col: 3, regionId: 'region-4' },
      { row: 4, col: 4, regionId: 'region-4' },
      { row: 5, col: 3, regionId: 'region-4' },
      { row: 5, col: 4, regionId: 'region-4' },
      // Teal corner (region-5)
      { row: 4, col: 0, regionId: 'region-5' },
      { row: 5, col: 0, regionId: 'region-5' },
      { row: 5, col: 1, regionId: 'region-5' },
      { row: 5, col: 2, regionId: 'region-5' },
    ],
    regions: [
      { regionId: 'region-0', type: RuleType.SUM_AT_LEAST, value: 11 },
      { regionId: 'region-1', type: RuleType.SUM_AT_MOST, value: 13 },
      { regionId: 'region-2', type: RuleType.SUM_AT_LEAST, value: 10 },
      { regionId: 'region-3', type: RuleType.SUM_AT_MOST, value: 14 },
      { regionId: 'region-4', type: RuleType.VALUES_EQUAL, value: 0 },
      { regionId: 'region-5', type: RuleType.SUM_AT_LEAST, value: 12 },
    ],
  },
  // Template 4: Split board
  {
    rows: 6,
    cols: 6,
    cells: [
      // Orange top-left (region-0)
      { row: 0, col: 0, regionId: 'region-0' },
      { row: 0, col: 1, regionId: 'region-0' },
      { row: 1, col: 0, regionId: 'region-0' },
      { row: 1, col: 1, regionId: 'region-0' },
      // Purple top-right (region-1)
      { row: 0, col: 4, regionId: 'region-1' },
      { row: 0, col: 5, regionId: 'region-1' },
      { row: 1, col: 4, regionId: 'region-1' },
      { row: 1, col: 5, regionId: 'region-1' },
      // Green middle-left (region-2)
      { row: 2, col: 0, regionId: 'region-2' },
      { row: 2, col: 1, regionId: 'region-2' },
      { row: 3, col: 0, regionId: 'region-2' },
      { row: 3, col: 1, regionId: 'region-2' },
      // Blue middle-right (region-3)
      { row: 2, col: 4, regionId: 'region-3' },
      { row: 2, col: 5, regionId: 'region-3' },
      { row: 3, col: 4, regionId: 'region-3' },
      { row: 3, col: 5, regionId: 'region-3' },
      // Pink bottom-left (region-4)
      { row: 4, col: 0, regionId: 'region-4' },
      { row: 4, col: 1, regionId: 'region-4' },
      { row: 5, col: 0, regionId: 'region-4' },
      { row: 5, col: 1, regionId: 'region-4' },
      // Teal bottom-right (region-5)
      { row: 4, col: 4, regionId: 'region-5' },
      { row: 4, col: 5, regionId: 'region-5' },
      { row: 5, col: 4, regionId: 'region-5' },
      { row: 5, col: 5, regionId: 'region-5' },
    ],
    regions: [
      { regionId: 'region-0', type: RuleType.SUM_AT_LEAST, value: 9 },
      { regionId: 'region-1', type: RuleType.SUM_AT_MOST, value: 11 },
      { regionId: 'region-2', type: RuleType.VALUES_ALL_DIFFERENT, value: 0 },
      { regionId: 'region-3', type: RuleType.SUM_AT_LEAST, value: 10 },
      { regionId: 'region-4', type: RuleType.SUM_AT_MOST, value: 12 },
      { regionId: 'region-5', type: RuleType.SUM_AT_LEAST, value: 11 },
    ],
  },
  // Template 5: Central cross with corners
  {
    rows: 6,
    cols: 6,
    cells: [
      // Orange cross center (region-0)
      { row: 2, col: 2, regionId: 'region-0' },
      { row: 2, col: 3, regionId: 'region-0' },
      { row: 3, col: 2, regionId: 'region-0' },
      { row: 3, col: 3, regionId: 'region-0' },
      // Purple top-left (region-1)
      { row: 0, col: 0, regionId: 'region-1' },
      { row: 0, col: 1, regionId: 'region-1' },
      { row: 1, col: 0, regionId: 'region-1' },
      { row: 1, col: 1, regionId: 'region-1' },
      // Green top-right (region-2)
      { row: 0, col: 4, regionId: 'region-2' },
      { row: 0, col: 5, regionId: 'region-2' },
      { row: 1, col: 4, regionId: 'region-2' },
      { row: 1, col: 5, regionId: 'region-2' },
      // Blue bottom-left (region-3)
      { row: 4, col: 0, regionId: 'region-3' },
      { row: 4, col: 1, regionId: 'region-3' },
      { row: 5, col: 0, regionId: 'region-3' },
      { row: 5, col: 1, regionId: 'region-3' },
      // Pink bottom-right (region-4)
      { row: 4, col: 4, regionId: 'region-4' },
      { row: 4, col: 5, regionId: 'region-4' },
      { row: 5, col: 4, regionId: 'region-4' },
      { row: 5, col: 5, regionId: 'region-4' },
      // Teal sides (region-5)
      { row: 1, col: 2, regionId: 'region-5' },
      { row: 1, col: 3, regionId: 'region-5' },
      { row: 2, col: 1, regionId: 'region-5' },
      { row: 3, col: 1, regionId: 'region-5' },
      { row: 2, col: 4, regionId: 'region-5' },
      { row: 3, col: 4, regionId: 'region-5' },
      { row: 4, col: 2, regionId: 'region-5' },
      { row: 4, col: 3, regionId: 'region-5' },
    ],
    regions: [
      { regionId: 'region-0', type: RuleType.SUM_AT_LEAST, value: 10 },
      { regionId: 'region-1', type: RuleType.SUM_AT_MOST, value: 11 },
      { regionId: 'region-2', type: RuleType.SUM_AT_LEAST, value: 9 },
      { regionId: 'region-3', type: RuleType.SUM_AT_MOST, value: 12 },
      { regionId: 'region-4', type: RuleType.VALUES_EQUAL, value: 0 },
      { regionId: 'region-5', type: RuleType.SUM_AT_LEAST, value: 16 },
    ],
  },
];

// Hard templates - most complex shapes, most regions
export const HARD_TEMPLATES: ShapeTemplate[] = [
  // Template 1: Very sparse with many small regions
  {
    rows: 6,
    cols: 6,
    cells: [
      // Orange (region-0)
      { row: 0, col: 0, regionId: 'region-0' },
      { row: 0, col: 1, regionId: 'region-0' },
      // Purple (region-1)
      { row: 0, col: 3, regionId: 'region-1' },
      { row: 1, col: 3, regionId: 'region-1' },
      // Green (region-2)
      { row: 0, col: 5, regionId: 'region-2' },
      { row: 1, col: 5, regionId: 'region-2' },
      // Blue (region-3)
      { row: 1, col: 0, regionId: 'region-3' },
      { row: 2, col: 0, regionId: 'region-3' },
      // Pink (region-4)
      { row: 2, col: 2, regionId: 'region-4' },
      { row: 2, col: 3, regionId: 'region-4' },
      // Teal (region-5)
      { row: 1, col: 2, regionId: 'region-5' },
      { row: 2, col: 1, regionId: 'region-5' },
      // Amber (region-6)
      { row: 3, col: 0, regionId: 'region-6' },
      { row: 3, col: 1, regionId: 'region-6' },
      { row: 4, col: 0, regionId: 'region-6' },
      // Indigo (region-7)
      { row: 3, col: 3, regionId: 'region-7' },
      { row: 3, col: 4, regionId: 'region-7' },
      { row: 4, col: 3, regionId: 'region-7' },
      { row: 4, col: 4, regionId: 'region-7' },
      { row: 5, col: 3, regionId: 'region-7' },
      { row: 5, col: 4, regionId: 'region-7' },
      // Rose (region-8)
      { row: 4, col: 1, regionId: 'region-8' },
      { row: 5, col: 0, regionId: 'region-8' },
      { row: 5, col: 1, regionId: 'region-8' },
      { row: 5, col: 2, regionId: 'region-8' },
    ],
    regions: [
      { regionId: 'region-0', type: RuleType.SUM_AT_LEAST, value: 5 },
      { regionId: 'region-1', type: RuleType.SUM_AT_MOST, value: 7 },
      { regionId: 'region-2', type: RuleType.VALUES_EQUAL, value: 0 },
      { regionId: 'region-3', type: RuleType.SUM_AT_LEAST, value: 6 },
      { regionId: 'region-4', type: RuleType.SUM_AT_MOST, value: 8 },
      { regionId: 'region-5', type: RuleType.VALUES_ALL_DIFFERENT, value: 0 },
      { regionId: 'region-6', type: RuleType.SUM_AT_LEAST, value: 9 },
      { regionId: 'region-7', type: RuleType.SUM_AT_MOST, value: 15 },
      { regionId: 'region-8', type: RuleType.SUM_AT_LEAST, value: 10 },
    ],
  },
  // Template 2: Complex interlocking shapes
  {
    rows: 6,
    cols: 6,
    cells: [
      // Orange (region-0)
      { row: 0, col: 0, regionId: 'region-0' },
      { row: 0, col: 1, regionId: 'region-0' },
      { row: 1, col: 0, regionId: 'region-0' },
      // Purple (region-1)
      { row: 0, col: 3, regionId: 'region-1' },
      { row: 0, col: 4, regionId: 'region-1' },
      { row: 1, col: 3, regionId: 'region-1' },
      // Green (region-2)
      { row: 1, col: 1, regionId: 'region-2' },
      { row: 1, col: 2, regionId: 'region-2' },
      { row: 2, col: 1, regionId: 'region-2' },
      // Blue (region-3)
      { row: 2, col: 3, regionId: 'region-3' },
      { row: 2, col: 4, regionId: 'region-3' },
      { row: 3, col: 3, regionId: 'region-3' },
      // Pink (region-4)
      { row: 2, col: 0, regionId: 'region-4' },
      { row: 3, col: 0, regionId: 'region-4' },
      { row: 3, col: 1, regionId: 'region-4' },
      // Teal (region-5)
      { row: 3, col: 4, regionId: 'region-5' },
      { row: 4, col: 3, regionId: 'region-5' },
      { row: 4, col: 4, regionId: 'region-5' },
      // Amber (region-6)
      { row: 4, col: 0, regionId: 'region-6' },
      { row: 4, col: 1, regionId: 'region-6' },
      { row: 5, col: 0, regionId: 'region-6' },
      { row: 5, col: 1, regionId: 'region-6' },
      // Indigo (region-7)
      { row: 4, col: 5, regionId: 'region-7' },
      { row: 5, col: 4, regionId: 'region-7' },
      { row: 5, col: 5, regionId: 'region-7' },
    ],
    regions: [
      { regionId: 'region-0', type: RuleType.SUM_AT_LEAST, value: 8 },
      { regionId: 'region-1', type: RuleType.SUM_AT_MOST, value: 10 },
      { regionId: 'region-2', type: RuleType.VALUES_EQUAL, value: 0 },
      { regionId: 'region-3', type: RuleType.SUM_AT_LEAST, value: 9 },
      { regionId: 'region-4', type: RuleType.SUM_AT_MOST, value: 11 },
      { regionId: 'region-5', type: RuleType.VALUES_ALL_DIFFERENT, value: 0 },
      { regionId: 'region-6', type: RuleType.SUM_AT_LEAST, value: 12 },
      { regionId: 'region-7', type: RuleType.SUM_AT_MOST, value: 9 },
    ],
  },
  // Template 3: Scattered small islands
  {
    rows: 6,
    cols: 6,
    cells: [
      // Orange (region-0)
      { row: 0, col: 1, regionId: 'region-0' },
      { row: 1, col: 1, regionId: 'region-0' },
      // Purple (region-1)
      { row: 0, col: 4, regionId: 'region-1' },
      { row: 1, col: 4, regionId: 'region-1' },
      // Green (region-2)
      { row: 1, col: 0, regionId: 'region-2' },
      { row: 2, col: 0, regionId: 'region-2' },
      // Blue (region-3)
      { row: 2, col: 2, regionId: 'region-3' },
      { row: 2, col: 3, regionId: 'region-3' },
      { row: 3, col: 2, regionId: 'region-3' },
      // Pink (region-4)
      { row: 1, col: 5, regionId: 'region-4' },
      { row: 2, col: 5, regionId: 'region-4' },
      { row: 3, col: 5, regionId: 'region-4' },
      // Teal (region-5)
      { row: 3, col: 0, regionId: 'region-5' },
      { row: 4, col: 0, regionId: 'region-5' },
      { row: 4, col: 1, regionId: 'region-5' },
      // Amber (region-6)
      { row: 3, col: 3, regionId: 'region-6' },
      { row: 4, col: 3, regionId: 'region-6' },
      { row: 4, col: 4, regionId: 'region-6' },
      { row: 5, col: 3, regionId: 'region-6' },
      // Indigo (region-7)
      { row: 4, col: 5, regionId: 'region-7' },
      { row: 5, col: 4, regionId: 'region-7' },
      { row: 5, col: 5, regionId: 'region-7' },
    ],
    regions: [
      { regionId: 'region-0', type: RuleType.SUM_AT_LEAST, value: 6 },
      { regionId: 'region-1', type: RuleType.SUM_AT_MOST, value: 8 },
      { regionId: 'region-2', type: RuleType.VALUES_EQUAL, value: 0 },
      { regionId: 'region-3', type: RuleType.SUM_AT_LEAST, value: 9 },
      { regionId: 'region-4', type: RuleType.VALUES_ALL_DIFFERENT, value: 0 },
      { regionId: 'region-5', type: RuleType.SUM_AT_MOST, value: 10 },
      { regionId: 'region-6', type: RuleType.SUM_AT_LEAST, value: 11 },
      { regionId: 'region-7', type: RuleType.SUM_AT_MOST, value: 9 },
    ],
  },
  // Template 4: Diagonal patterns
  {
    rows: 6,
    cols: 6,
    cells: [
      // Orange (region-0)
      { row: 0, col: 0, regionId: 'region-0' },
      { row: 0, col: 1, regionId: 'region-0' },
      { row: 1, col: 0, regionId: 'region-0' },
      // Purple (region-1)
      { row: 0, col: 3, regionId: 'region-1' },
      { row: 0, col: 4, regionId: 'region-1' },
      { row: 1, col: 4, regionId: 'region-1' },
      // Green (region-2)
      { row: 1, col: 2, regionId: 'region-2' },
      { row: 2, col: 1, regionId: 'region-2' },
      { row: 2, col: 2, regionId: 'region-2' },
      // Blue (region-3)
      { row: 2, col: 4, regionId: 'region-3' },
      { row: 3, col: 3, regionId: 'region-3' },
      { row: 3, col: 4, regionId: 'region-3' },
      // Pink (region-4)
      { row: 2, col: 0, regionId: 'region-4' },
      { row: 3, col: 0, regionId: 'region-4' },
      { row: 3, col: 1, regionId: 'region-4' },
      // Teal (region-5)
      { row: 4, col: 1, regionId: 'region-5' },
      { row: 4, col: 2, regionId: 'region-5' },
      { row: 5, col: 1, regionId: 'region-5' },
      { row: 5, col: 2, regionId: 'region-5' },
      // Amber (region-6)
      { row: 4, col: 4, regionId: 'region-6' },
      { row: 4, col: 5, regionId: 'region-6' },
      { row: 5, col: 4, regionId: 'region-6' },
      { row: 5, col: 5, regionId: 'region-6' },
      // Indigo (region-7)
      { row: 3, col: 5, regionId: 'region-7' },
      { row: 4, col: 0, regionId: 'region-7' },
      { row: 5, col: 0, regionId: 'region-7' },
    ],
    regions: [
      { regionId: 'region-0', type: RuleType.SUM_AT_LEAST, value: 8 },
      { regionId: 'region-1', type: RuleType.SUM_AT_MOST, value: 10 },
      { regionId: 'region-2', type: RuleType.VALUES_EQUAL, value: 0 },
      { regionId: 'region-3', type: RuleType.SUM_AT_LEAST, value: 9 },
      { regionId: 'region-4', type: RuleType.VALUES_ALL_DIFFERENT, value: 0 },
      { regionId: 'region-5', type: RuleType.SUM_AT_MOST, value: 13 },
      { regionId: 'region-6', type: RuleType.SUM_AT_LEAST, value: 11 },
      { regionId: 'region-7', type: RuleType.SUM_AT_MOST, value: 9 },
    ],
  },
  // Template 5: Extreme sparse
  {
    rows: 6,
    cols: 6,
    cells: [
      // Orange (region-0)
      { row: 0, col: 0, regionId: 'region-0' },
      { row: 1, col: 0, regionId: 'region-0' },
      // Purple (region-1)
      { row: 0, col: 2, regionId: 'region-1' },
      { row: 0, col: 3, regionId: 'region-1' },
      // Green (region-2)
      { row: 0, col: 5, regionId: 'region-2' },
      { row: 1, col: 5, regionId: 'region-2' },
      // Blue (region-3)
      { row: 1, col: 2, regionId: 'region-3' },
      { row: 2, col: 2, regionId: 'region-3' },
      // Pink (region-4)
      { row: 2, col: 0, regionId: 'region-4' },
      { row: 3, col: 0, regionId: 'region-4' },
      { row: 3, col: 1, regionId: 'region-4' },
      // Teal (region-5)
      { row: 2, col: 4, regionId: 'region-5' },
      { row: 2, col: 5, regionId: 'region-5' },
      { row: 3, col: 4, regionId: 'region-5' },
      // Amber (region-6)
      { row: 4, col: 1, regionId: 'region-6' },
      { row: 4, col: 2, regionId: 'region-6' },
      { row: 5, col: 1, regionId: 'region-6' },
      { row: 5, col: 2, regionId: 'region-6' },
      // Indigo (region-7)
      { row: 4, col: 4, regionId: 'region-7' },
      { row: 4, col: 5, regionId: 'region-7' },
      { row: 5, col: 4, regionId: 'region-7' },
      { row: 5, col: 5, regionId: 'region-7' },
    ],
    regions: [
      { regionId: 'region-0', type: RuleType.SUM_AT_LEAST, value: 5 },
      { regionId: 'region-1', type: RuleType.SUM_AT_MOST, value: 7 },
      { regionId: 'region-2', type: RuleType.VALUES_EQUAL, value: 0 },
      { regionId: 'region-3', type: RuleType.VALUES_ALL_DIFFERENT, value: 0 },
      { regionId: 'region-4', type: RuleType.SUM_AT_LEAST, value: 9 },
      { regionId: 'region-5', type: RuleType.SUM_AT_MOST, value: 11 },
      { regionId: 'region-6', type: RuleType.SUM_AT_LEAST, value: 12 },
      { regionId: 'region-7', type: RuleType.SUM_AT_MOST, value: 13 },
    ],
  },
];

// Helper function to get a random template for a difficulty
export function getRandomTemplate(
  difficulty: 'easy' | 'medium' | 'hard',
  random: { randomInt: (min: number, max: number) => number }
): ShapeTemplate {
  const templates = 
    difficulty === 'easy' ? EASY_TEMPLATES :
    difficulty === 'medium' ? MEDIUM_TEMPLATES :
    HARD_TEMPLATES;
  
  const index = random.randomInt(0, templates.length - 1);
  return templates[index];
}

