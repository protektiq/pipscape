// Visual effects for Pipscape UI
// Frosted glass, shadows, animations

// Frosted glass effect (backdrop blur)
export const FROSTED_GLASS = {
  light: {
    background: 'rgba(255, 255, 255, 0.95)',
    backdrop: 'blur(16px)',
    border: 'rgba(255, 255, 255, 1)',
  },
  medium: {
    background: 'rgba(255, 255, 255, 0.98)',
    backdrop: 'blur(18px)',
    border: 'rgba(255, 255, 255, 1)',
  },
  strong: {
    background: 'rgba(255, 255, 255, 1)',
    backdrop: 'blur(20px)',
    border: 'rgba(255, 255, 255, 1)',
  },
} as const;

// Shadow definitions
export const SHADOWS = {
  // Soft shadows for cards
  card: '0 4px 24px rgba(0, 0, 0, 0.07)',
  cardHover: '0 8px 32px rgba(0, 0, 0, 0.12)',
  
  // Inner shadows for depth
  inner: 'inset 0 2px 4px rgba(0, 0, 0, 0.06)',
  innerStrong: 'inset 0 2px 8px rgba(0, 0, 0, 0.1)',
  
  // Glow effects for regions
  glow: '0 0 12px rgba(0, 0, 0, 0.1)',
  glowColored: (color: string) => `0 0 16px ${color}`,
  
  // Subtle shadows
  subtle: '0 1px 3px rgba(0, 0, 0, 0.05)',
  medium: '0 4px 12px rgba(0, 0, 0, 0.08)',
} as const;

// Border radius
export const BORDER_RADIUS = {
  sm: '0.5rem',   // 8px
  md: '0.75rem',  // 12px
  lg: '1rem',     // 16px
  xl: '1.25rem',  // 20px
  '2xl': '1.5rem', // 24px
  full: '9999px',
} as const;

// Animation durations (in milliseconds)
export const ANIMATION_DURATION = {
  fast: 150,
  normal: 300,
  slow: 500,
  slower: 750,
} as const;

// Animation easing functions
export const EASING = {
  easeIn: 'cubic-bezier(0.4, 0, 1, 1)',
  easeOut: 'cubic-bezier(0, 0, 0.2, 1)',
  easeInOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
  spring: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
} as const;

// Transition presets
export const TRANSITIONS = {
  default: `all ${ANIMATION_DURATION.normal}ms ${EASING.easeInOut}`,
  fast: `all ${ANIMATION_DURATION.fast}ms ${EASING.easeOut}`,
  slow: `all ${ANIMATION_DURATION.slow}ms ${EASING.easeInOut}`,
  spring: `all ${ANIMATION_DURATION.normal}ms ${EASING.spring}`,
} as const;

// CSS class utilities (for Tailwind)
export const EFFECT_CLASSES = {
  frostedGlass: 'backdrop-blur-xl bg-white/95 border border-white',
  frostedGlassStrong: 'backdrop-blur-2xl bg-white/98 border border-white',
  cardShadow: 'shadow-[0_4px_24px_rgba(0,0,0,0.07)]',
  cardShadowHover: 'shadow-[0_8px_32px_rgba(0,0,0,0.12)]',
  innerShadow: 'shadow-inner',
  glow: 'shadow-[0_0_12px_rgba(0,0,0,0.1)]',
  roundedXL: 'rounded-2xl',
} as const;

