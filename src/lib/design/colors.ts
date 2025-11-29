// Pastel color palette for Pipscape (distinct from NYT Pips)
// Soft, vibrant pastel colors for regions

export type ColorDefinition = {
  name: string;
  bg: string;      // Background color (RGB)
  border: string;  // Border color (RGB)
  glow: string;    // Glow color (RGBA)
  text: string;    // Text color for contrast
};

export const PASTEL_COLORS: ColorDefinition[] = [
  {
    name: 'lavender',
    bg: 'rgb(140, 120, 175)',
    border: 'rgb(110, 80, 150)',
    glow: 'rgba(140, 120, 175, 0.7)',
    text: 'rgb(80, 60, 120)',
  },
  {
    name: 'mint',
    bg: 'rgb(100, 170, 185)',
    border: 'rgb(60, 140, 160)',
    glow: 'rgba(100, 170, 185, 0.7)',
    text: 'rgb(20, 100, 110)',
  },
  {
    name: 'peach',
    bg: 'rgb(255, 160, 120)',
    border: 'rgb(255, 125, 80)',
    glow: 'rgba(255, 160, 120, 0.7)',
    text: 'rgb(180, 100, 60)',
  },
  {
    name: 'rose',
    bg: 'rgb(255, 130, 150)',
    border: 'rgb(255, 100, 130)',
    glow: 'rgba(255, 130, 150, 0.7)',
    text: 'rgb(180, 80, 100)',
  },
  {
    name: 'sky',
    bg: 'rgb(110, 160, 180)',
    border: 'rgb(70, 135, 175)',
    glow: 'rgba(110, 160, 180, 0.7)',
    text: 'rgb(30, 120, 150)',
  },
  {
    name: 'amber',
    bg: 'rgb(240, 160, 60)',
    border: 'rgb(220, 140, 40)',
    glow: 'rgba(240, 160, 60, 0.7)',
    text: 'rgb(140, 90, 20)',
  },
  {
    name: 'lilac',
    bg: 'rgb(170, 135, 205)',
    border: 'rgb(140, 100, 200)',
    glow: 'rgba(170, 135, 205, 0.7)',
    text: 'rgb(120, 80, 180)',
  },
  {
    name: 'sage',
    bg: 'rgb(125, 155, 125)',
    border: 'rgb(90, 130, 90)',
    glow: 'rgba(125, 155, 125, 0.7)',
    text: 'rgb(60, 100, 60)',
  },
  {
    name: 'coral',
    bg: 'rgb(255, 140, 110)',
    border: 'rgb(255, 110, 85)',
    glow: 'rgba(255, 140, 110, 0.7)',
    text: 'rgb(200, 100, 70)',
  },
  {
    name: 'periwinkle',
    bg: 'rgb(145, 145, 205)',
    border: 'rgb(115, 115, 195)',
    glow: 'rgba(145, 145, 205, 0.7)',
    text: 'rgb(100, 100, 180)',
  },
];

// Get color by name
export function getColorByName(name: string): ColorDefinition | undefined {
  return PASTEL_COLORS.find(c => c.name === name);
}

// Get color by index (with wrapping)
export function getColorByIndex(index: number): ColorDefinition {
  return PASTEL_COLORS[index % PASTEL_COLORS.length];
}

// Generate consistent color from region ID
export function getColorForRegion(regionId: string, index: number = 0): ColorDefinition {
  const hash = regionId.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const colorIndex = (hash + index) % PASTEL_COLORS.length;
  return PASTEL_COLORS[colorIndex];
}

// UI color palette (for backgrounds, text, etc.)
export const UI_COLORS = {
  background: {
    primary: 'rgb(249, 250, 251)',      // gray-50
    secondary: 'rgb(255, 255, 255)',     // white
    frosted: 'rgba(255, 255, 255, 0.95)', // frosted glass
  },
  text: {
    primary: 'rgb(17, 24, 39)',         // gray-900
    secondary: 'rgb(107, 114, 128)',    // gray-500
    muted: 'rgb(156, 163, 175)',        // gray-400
  },
  border: {
    light: 'rgba(229, 231, 235, 0.5)',  // gray-200 with opacity
    medium: 'rgba(209, 213, 219, 0.6)', // gray-300 with opacity
  },
  shadow: {
    soft: 'rgba(0, 0, 0, 0.07)',
    medium: 'rgba(0, 0, 0, 0.1)',
    strong: 'rgba(0, 0, 0, 0.15)',
  },
} as const;

