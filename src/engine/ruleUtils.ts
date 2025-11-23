import type { RegionRule } from '../types/puzzle';

// Format rule label for display
export const formatRuleLabel = (rule: RegionRule): string => {
  if (rule.type === 'SUM_AT_LEAST') {
    return `≥${rule.value}`;
  } else if (rule.type === 'SUM_AT_MOST') {
    return `≤${rule.value}`;
  } else if (rule.type === 'VALUES_EQUAL') {
    return '=';
  } else if (rule.type === 'VALUES_ALL_DIFFERENT') {
    return '≠';
  }
  return `${rule.value}`;
};

