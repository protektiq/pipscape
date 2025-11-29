import { memo } from 'react';
import type { RegionRule } from '../types/puzzle';
import { formatRuleLabel } from '../engine/ruleUtils';
import type { RegionColor } from '../templates/types';

interface RegionBadgeProps {
  rule: RegionRule;
  color?: RegionColor;
  position: { top: number; left: number };
  cellSize: number;
}

const RegionBadge = ({ rule, color, position, cellSize }: RegionBadgeProps) => {
  const label = formatRuleLabel(rule);
  const bgColor = color?.bg || 'rgb(200, 181, 226)';
  const borderColor = color?.border || 'rgb(167, 139, 201)';
  const glowColor = color?.glow || 'rgba(200, 181, 226, 0.4)';
  const textColor = color?.text || 'rgb(80, 60, 120)';

  // Determine icon based on rule type
  // SUM_EQUALS shows only the number (no icon)
  const getIcon = () => {
    switch (rule.type) {
      case 'SUM_EQUALS':
        return null; // No icon for equals - just show the number
      case 'SUM_LESS_THAN':
        return '<';
      case 'SUM_GREATER_THAN':
        return '>';
      case 'VALUES_EQUAL':
        return '≡';
      case 'VALUES_NOT_EQUAL':
        return '≠';
      default:
        return null;
    }
  };

  const icon = getIcon();

  return (
    <div
      className="absolute pointer-events-none z-30"
      style={{
        top: `${position.top}px`,
        left: `${position.left}px`,
        transform: 'translate(-50%, -50%)',
      }}
    >
      <div
        className="px-2 py-1 rounded-full text-xs font-semibold flex items-center justify-center shadow-md"
        style={{
          backgroundColor: bgColor,
          border: `1px solid ${borderColor}`,
          color: textColor,
          boxShadow: `0 2px 8px ${glowColor}, 0 1px 3px rgba(0, 0, 0, 0.2)`,
          fontSize: `${Math.max(10, cellSize * 0.15)}px`,
          minWidth: `${Math.max(32, cellSize * 0.5)}px`,
          gap: icon ? '0.25rem' : '0',
        }}
      >
        {icon && <span className="text-[0.7em] opacity-90">{icon}</span>}
        <span>{label}</span>
      </div>
    </div>
  );
};

export default memo(RegionBadge);

