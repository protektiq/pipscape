// Tests for template loading

import { describe, it, expect } from 'vitest';
import { getTemplatesForDifficulty, getRandomTemplate, getTemplateById } from '../../../templates/loader';

describe('Template Loader', () => {
  it('should load templates for easy difficulty', () => {
    const templates = getTemplatesForDifficulty('easy');
    
    expect(templates.length).toBeGreaterThan(0);
    templates.forEach(template => {
      expect(template.difficulty).toBe('easy');
      expect(template.cells.length).toBeGreaterThan(0);
      expect(template.regions.length).toBeGreaterThan(0);
      expect(template.regionColors).toBeDefined();
    });
  });

  it('should load templates with region colors', () => {
    const templates = getTemplatesForDifficulty('medium');
    
    templates.forEach(template => {
      if (template.regionColors) {
        Object.values(template.regionColors).forEach(color => {
          expect(color.bg).toBeDefined();
          expect(color.border).toBeDefined();
        });
      }
    });
  });

  it('should get random template for difficulty', () => {
    const random = {
      randomInt: (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min,
    };
    
    const template = getRandomTemplate('hard', random);
    
    expect(template).toBeDefined();
    expect(template.difficulty).toBe('hard');
    expect(template.cells.length).toBeGreaterThan(0);
  });

  it('should get template by ID', () => {
    const templates = getTemplatesForDifficulty('easy');
    if (templates.length > 0) {
      const template = templates[0];
      const found = getTemplateById(template.id);
      
      expect(found).toBeDefined();
      expect(found?.id).toBe(template.id);
    }
  });
});

