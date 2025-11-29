import type { RegionRule } from '../types/puzzle';

// Format rule label for display
export const formatRuleLabel = (rule: RegionRule): string => {
  if (rule.type === 'SUM_EQUALS') {
    return `${rule.value}`;
  } else if (rule.type === 'SUM_LESS_THAN') {
    return `<${rule.value}`;
  } else if (rule.type === 'SUM_GREATER_THAN') {
    return `>${rule.value}`;
  } else if (rule.type === 'VALUES_EQUAL') {
    return '=';
  } else if (rule.type === 'VALUES_NOT_EQUAL') {
    return '≠';
  }
  return `${rule.value}`;
};

