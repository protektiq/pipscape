import type { RegionRule } from '../types/puzzle';

// Format rule label for display (just the value, icon is handled by RegionBadge)
export const formatRuleLabel = (rule: RegionRule): string => {
  // For comparison rules, just return the value (icon is shown separately)
  if (rule.type === 'SUM_EQUALS' || rule.type === 'SUM_LESS_THAN' || rule.type === 'SUM_GREATER_THAN') {
    return `${rule.value}`;
  }
  // For equality rules, return empty string (icon is shown separately)
  if (rule.type === 'VALUES_EQUAL' || rule.type === 'VALUES_NOT_EQUAL') {
    return '';
  }
  return `${rule.value}`;
};

