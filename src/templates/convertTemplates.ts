// Utility to convert templates.ts templates to JSON format
// This is a one-time conversion script

import { EASY_TEMPLATES, MEDIUM_TEMPLATES, HARD_TEMPLATES } from '../engine/templates';
import type { ShapeTemplate as OldTemplate } from '../engine/templates';
import type { ShapeTemplate } from './types';

// Pastel color palette (distinct from NYT)
const PASTEL_COLORS = [
  { name: 'lavender', bg: 'rgb(200, 181, 226)', border: 'rgb(167, 139, 201)', glow: 'rgba(200, 181, 226, 0.4)' },
  { name: 'mint', bg: 'rgb(166, 227, 233)', border: 'rgb(129, 201, 209)', glow: 'rgba(166, 227, 233, 0.4)' },
  { name: 'peach', bg: 'rgb(255, 218, 193)', border: 'rgb(255, 183, 145)', glow: 'rgba(255, 218, 193, 0.4)' },
  { name: 'rose', bg: 'rgb(255, 192, 203)', border: 'rgb(255, 160, 180)', glow: 'rgba(255, 192, 203, 0.4)' },
  { name: 'sky', bg: 'rgb(176, 224, 230)', border: 'rgb(135, 206, 235)', glow: 'rgba(176, 224, 230, 0.4)' },
  { name: 'lemon', bg: 'rgb(255, 250, 205)', border: 'rgb(255, 245, 180)', glow: 'rgba(255, 250, 205, 0.4)' },
  { name: 'lilac', bg: 'rgb(230, 200, 255)', border: 'rgb(200, 160, 255)', glow: 'rgba(230, 200, 255, 0.4)' },
  { name: 'sage', bg: 'rgb(188, 212, 188)', border: 'rgb(152, 186, 152)', glow: 'rgba(188, 212, 188, 0.4)' },
  { name: 'coral', bg: 'rgb(255, 204, 188)', border: 'rgb(255, 173, 153)', glow: 'rgba(255, 204, 188, 0.4)' },
  { name: 'periwinkle', bg: 'rgb(204, 204, 255)', border: 'rgb(170, 170, 255)', glow: 'rgba(204, 204, 255, 0.4)' },
];

function getColorForRegion(regionId: string, index: number) {
  const hash = regionId.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const colorIndex = (hash + index) % PASTEL_COLORS.length;
  return PASTEL_COLORS[colorIndex];
}

function convertTemplate(oldTemplate: OldTemplate, index: number, difficulty: 'easy' | 'medium' | 'hard'): ShapeTemplate {
  const regionIds = [...new Set(oldTemplate.cells.map(c => c.regionId))];
  const regionColors: Record<string, typeof PASTEL_COLORS[0]> = {};
  regionIds.forEach((regionId, idx) => {
    regionColors[regionId] = getColorForRegion(regionId, idx);
  });

  // Calculate empty spaces (cells in bounding box that aren't in template)
  const allCells = new Set(oldTemplate.cells.map(c => `${c.row}-${c.col}`));
  const emptySpaces: Array<{ row: number; col: number }> = [];
  for (let row = 0; row < oldTemplate.rows; row++) {
    for (let col = 0; col < oldTemplate.cols; col++) {
      if (!allCells.has(`${row}-${col}`)) {
        emptySpaces.push({ row, col });
      }
    }
  }

  return {
    id: `${difficulty}-template-${index}`,
    name: `Template ${index + 1}`,
    description: `${difficulty} difficulty puzzle with ${oldTemplate.cells.length} cells and ${regionIds.length} regions`,
    difficulty,
    rows: oldTemplate.rows,
    cols: oldTemplate.cols,
    cells: oldTemplate.cells,
    regions: oldTemplate.regions,
    regionColors,
    emptySpaces: emptySpaces.length > 0 ? emptySpaces : undefined,
    cellCount: oldTemplate.cells.length,
    regionCount: regionIds.length,
  };
}

export function getAllTemplates(): { easy: ShapeTemplate[]; medium: ShapeTemplate[]; hard: ShapeTemplate[] } {
  return {
    easy: EASY_TEMPLATES.map((t, i) => convertTemplate(t, i, 'easy')),
    medium: MEDIUM_TEMPLATES.map((t, i) => convertTemplate(t, i, 'medium')),
    hard: HARD_TEMPLATES.map((t, i) => convertTemplate(t, i, 'hard')),
  };
}

