import type { ShapeTemplate } from './types';

// Import old templates for backward compatibility during migration
import { EASY_TEMPLATES, MEDIUM_TEMPLATES, HARD_TEMPLATES } from '../engine/templates';
import type { ShapeTemplate as OldTemplate } from '../engine/templates';

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

// Convert old template format to new format
function convertOldTemplate(oldTemplate: OldTemplate, index: number, difficulty: 'easy' | 'medium' | 'hard'): ShapeTemplate {
  const regionIds = [...new Set(oldTemplate.cells.map(c => c.regionId))];
  const regionColors: Record<string, typeof PASTEL_COLORS[0]> = {};
  regionIds.forEach((regionId, idx) => {
    regionColors[regionId] = getColorForRegion(regionId, idx);
  });

  // Calculate empty spaces
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

// Load template from JSON file (for future use when all templates are migrated)
// Currently unused but kept for future migration
// async function loadTemplateFromJSON(difficulty: 'easy' | 'medium' | 'hard', index: number): Promise<ShapeTemplate | null> {
//   try {
//     // Use dynamic import for JSON files
//     const template = await import(`./${difficulty}/template-${index}.json?raw`);
//     return JSON.parse(template.default) as ShapeTemplate;
//   } catch {
//     // JSON file doesn't exist, fall back to old format
//     return null;
//   }
// }

// Get all templates for a difficulty (uses old format for now, will migrate to JSON)
export function getTemplatesForDifficulty(difficulty: 'easy' | 'medium' | 'hard'): ShapeTemplate[] {
  const oldTemplates = 
    difficulty === 'easy' ? EASY_TEMPLATES :
    difficulty === 'medium' ? MEDIUM_TEMPLATES :
    HARD_TEMPLATES;

  return oldTemplates.map((template, index) => convertOldTemplate(template, index, difficulty));
}

// Get a random template for a difficulty
export function getRandomTemplate(
  difficulty: 'easy' | 'medium' | 'hard',
  random: { randomInt: (min: number, max: number) => number }
): ShapeTemplate {
  console.log(`[getRandomTemplate] Getting templates for difficulty: ${difficulty}`);
  const templates = getTemplatesForDifficulty(difficulty);
  console.log(`[getRandomTemplate] Found ${templates.length} templates for ${difficulty}`);
  
  if (templates.length === 0) {
    throw new Error(`No templates available for difficulty: ${difficulty}`);
  }

  const index = random.randomInt(0, templates.length - 1);
  const selectedTemplate = templates[index];
  console.log(`[getRandomTemplate] Selected template index ${index}: ${selectedTemplate.id}, difficulty: ${selectedTemplate.difficulty}`);
  return selectedTemplate;
}

// Get template by ID
export function getTemplateById(templateId: string): ShapeTemplate | null {
  const [difficulty, , indexStr] = templateId.split('-');
  if (!difficulty || !indexStr) {
    return null;
  }

  const index = parseInt(indexStr, 10);
  if (isNaN(index)) {
    return null;
  }

  const templates = getTemplatesForDifficulty(difficulty as 'easy' | 'medium' | 'hard');
  return templates[index] || null;
}

// Get template metadata list
export function getTemplateMetadata(difficulty: 'easy' | 'medium' | 'hard'): Array<{ id: string; name?: string; cellCount: number; regionCount: number }> {
  const templates = getTemplatesForDifficulty(difficulty);
  return templates.map(t => ({
    id: t.id,
    name: t.name,
    cellCount: t.cellCount,
    regionCount: t.regionCount,
  }));
}

