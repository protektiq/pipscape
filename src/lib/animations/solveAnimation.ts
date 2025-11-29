// Solve animation utilities for Pipscape

import type { Placement } from '../../types/puzzle';

export interface AnimationConfig {
  duration: number; // milliseconds
  easing: string;
  stagger: number; // delay between each placement animation (ms)
}

export const DEFAULT_ANIMATION_CONFIG: AnimationConfig = {
  duration: 600,
  easing: 'cubic-bezier(0.4, 0, 0.2, 1)', // ease-in-out
  stagger: 50, // 50ms delay between each domino
};

/**
 * Calculate animation delay for each placement
 */
export function calculateAnimationDelays(
  placements: Placement[],
  config: AnimationConfig = DEFAULT_ANIMATION_CONFIG
): Map<string, number> {
  const delays = new Map<string, number>();
  
  placements.forEach((placement, index) => {
    delays.set(placement.id, index * config.stagger);
  });
  
  return delays;
}

/**
 * Get CSS transition string for animated placement
 */
export function getTransitionStyle(
  delay: number,
  config: AnimationConfig = DEFAULT_ANIMATION_CONFIG
): React.CSSProperties {
  return {
    transition: `all ${config.duration}ms ${config.easing}`,
    transitionDelay: `${delay}ms`,
  };
}

