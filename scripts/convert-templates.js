// Script to convert templates.ts to JSON files
import { readFileSync, writeFileSync, mkdirSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const rootDir = join(__dirname, '..');

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

function getColorForRegion(regionId, index) {
  const hash = regionId.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const colorIndex = (hash + index) % PASTEL_COLORS.length;
  return PASTEL_COLORS[colorIndex];
}

function convertTemplate(template, index, difficulty) {
  const regionIds = [...new Set(template.cells.map(c => c.regionId))];
  const regionColors = {};
  regionIds.forEach((regionId, idx) => {
    regionColors[regionId] = getColorForRegion(regionId, idx);
  });

  // Calculate empty spaces (cells in bounding box that aren't in template)
  const allCells = new Set(template.cells.map(c => `${c.row}-${c.col}`));
  const emptySpaces = [];
  for (let row = 0; row < template.rows; row++) {
    for (let col = 0; col < template.cols; col++) {
      if (!allCells.has(`${row}-${col}`)) {
        emptySpaces.push({ row, col });
      }
    }
  }

  return {
    id: `${difficulty}-template-${index}`,
    name: `Template ${index + 1}`,
    description: `${difficulty} difficulty puzzle with ${template.cells.length} cells and ${regionIds.length} regions`,
    difficulty,
    rows: template.rows,
    cols: template.cols,
    cells: template.cells,
    regions: template.regions,
    regionColors,
    emptySpaces: emptySpaces.length > 0 ? emptySpaces : undefined,
    cellCount: template.cells.length,
    regionCount: regionIds.length,
  };
}

// Read the templates.ts file and extract templates
const templatesPath = join(rootDir, 'src', 'engine', 'templates.ts');
const content = readFileSync(templatesPath, 'utf-8');

// Extract EASY_TEMPLATES, MEDIUM_TEMPLATES, HARD_TEMPLATES using regex
// This is a simplified parser - in production you might want a proper AST parser
const easyMatch = content.match(/export const EASY_TEMPLATES: ShapeTemplate\[\] = \[([\s\S]*?)\];/);
const mediumMatch = content.match(/export const MEDIUM_TEMPLATES: ShapeTemplate\[\] = \[([\s\S]*?)\];/);
const hardMatch = content.match(/export const HARD_TEMPLATES: ShapeTemplate\[\] = \[([\s\S]*?)\];/);

// For now, we'll need to manually parse or use eval in a controlled way
// Let's use a safer approach: import the templates module
async function convertTemplates() {
  try {
    // Dynamic import of the templates
    const templatesModule = await import(join(rootDir, 'src', 'engine', 'templates.ts'));
    
    const difficulties = ['easy', 'medium', 'hard'];
    const templateArrays = [
      templatesModule.EASY_TEMPLATES || [],
      templatesModule.MEDIUM_TEMPLATES || [],
      templatesModule.HARD_TEMPLATES || [],
    ];

    difficulties.forEach((difficulty, diffIndex) => {
      const templates = templateArrays[diffIndex];
      const dir = join(rootDir, 'src', 'templates', difficulty);
      mkdirSync(dir, { recursive: true });

      templates.forEach((template, index) => {
        const converted = convertTemplate(template, index, difficulty);
        const filename = join(dir, `template-${index}.json`);
        writeFileSync(filename, JSON.stringify(converted, null, 2), 'utf-8');
        console.log(`Created ${filename}`);
      });
    });

    console.log('Template conversion complete!');
  } catch (error) {
    console.error('Error converting templates:', error);
    // Fallback: create a few example templates manually
    console.log('Creating example templates manually...');
    createExampleTemplates();
  }
}

function createExampleTemplates() {
  // Create a few example templates manually as fallback
  const exampleEasy = {
    id: 'easy-template-0',
    name: 'Example Easy Template',
    description: 'Easy difficulty puzzle with 10 cells and 6 regions',
    difficulty: 'easy',
    rows: 4,
    cols: 4,
    cells: [
      { row: 0, col: 0, regionId: 'region-0' },
      { row: 0, col: 2, regionId: 'region-1' },
      { row: 1, col: 2, regionId: 'region-1' },
      { row: 2, col: 0, regionId: 'region-2' },
      { row: 1, col: 0, regionId: 'region-3' },
      { row: 1, col: 1, regionId: 'region-3' },
      { row: 2, col: 1, regionId: 'region-3' },
      { row: 2, col: 2, regionId: 'region-3' },
      { row: 3, col: 2, regionId: 'region-4' },
      { row: 3, col: 0, regionId: 'region-5' },
    ],
    regions: [
      { regionId: 'region-0', type: 'SUM_LESS_THAN', value: 3 },
      { regionId: 'region-1', type: 'SUM_EQUALS', value: 6 },
      { regionId: 'region-2', type: 'SUM_EQUALS', value: 6 },
      { regionId: 'region-3', type: 'SUM_EQUALS', value: 10 },
      { regionId: 'region-4', type: 'SUM_EQUALS', value: 6 },
      { regionId: 'region-5', type: 'SUM_LESS_THAN', value: 3 },
    ],
    regionColors: {
      'region-0': PASTEL_COLORS[0],
      'region-1': PASTEL_COLORS[1],
      'region-2': PASTEL_COLORS[2],
      'region-3': PASTEL_COLORS[3],
      'region-4': PASTEL_COLORS[4],
      'region-5': PASTEL_COLORS[5],
    },
    cellCount: 10,
    regionCount: 6,
  };

  const dir = join(rootDir, 'src', 'templates', 'easy');
  mkdirSync(dir, { recursive: true });
  writeFileSync(join(dir, 'template-0.json'), JSON.stringify(exampleEasy, null, 2), 'utf-8');
  console.log('Created example template');
}

convertTemplates();

