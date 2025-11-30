import { memo } from 'react';
import * as React from 'react';
import type { Region, Puzzle } from '../types/puzzle';
import { getRegionEdgeInfo, isOuterCorner, getBottomLeftCell } from '../engine/regionUtils';
import { getTemplateById } from '../templates/loader';
import { getColorForRegion } from '../lib/design/colors';
import RegionBadge from './RegionBadge';
import type { RegionColor } from '../templates/types';

interface RegionProps {
  region: Region;
  puzzle: Puzzle;
  allRegions: Region[];
  cellGap?: number;
  cellSize?: number; // Optional cellSize prop for print layouts
}

const RegionComponent = ({ region, puzzle, allRegions, cellGap = 0, cellSize: propCellSize }: RegionProps) => {
  // Calculate bounding box from all puzzle cells
  const bounds = React.useMemo(() => {
    if (puzzle.cells.length === 0) {
      return { minRow: 0, maxRow: 0, minCol: 0, maxCol: 0 };
    }
    const rows = puzzle.cells.map(c => c.row);
    const cols = puzzle.cells.map(c => c.col);
    return {
      minRow: Math.min(...rows),
      maxRow: Math.max(...rows),
      minCol: Math.min(...cols),
      maxCol: Math.max(...cols),
    };
  }, [puzzle.cells]);
  
  // Calculate responsive cell size (use prop if provided, otherwise calculate)
  const cellSize = React.useMemo(() => {
    if (propCellSize !== undefined) {
      return propCellSize;
    }
    // Default calculation for screen display
    const baseSize = 90;
    const maxWidth = 1400;
    const width = bounds.maxCol - bounds.minCol + 1;
    const calculatedWidth = width * baseSize;
    if (calculatedWidth > maxWidth) {
      return Math.floor(maxWidth / width);
    }
    return baseSize;
  }, [bounds, propCellSize]);
  // Get color from template if available, otherwise use fallback
  const templateColor = React.useMemo(() => {
    if (puzzle.shapeTemplate) {
      const template = getTemplateById(puzzle.shapeTemplate.id);
      if (template?.regionColors?.[region.id]) {
        return template.regionColors[region.id];
      }
    }
    // Fallback to new color system from colors.ts (has text color)
    const fallbackColor = getColorForRegion(region.id);
    return {
      name: fallbackColor.name,
      bg: fallbackColor.bg,
      border: fallbackColor.border,
      glow: fallbackColor.glow,
      text: fallbackColor.text,
    } as RegionColor;
  }, [puzzle.shapeTemplate, region.id]);

  const bottomLeftCell = getBottomLeftCell(region);
  
  // Get rule anchor position (explicit from template or calculated)
  const ruleAnchorPosition = React.useMemo(() => {
    if (puzzle.shapeTemplate) {
      const template = getTemplateById(puzzle.shapeTemplate.id);
      if (template?.ruleAnchors?.[region.id]) {
        const anchor = template.ruleAnchors[region.id];
        return {
          top: (anchor.row - bounds.minRow + 0.5) * (cellSize + cellGap),
          left: (anchor.col - bounds.minCol + 0.5) * (cellSize + cellGap),
        };
      }
    }
    // Fallback to calculated position (bottom-left)
    if (bottomLeftCell) {
      return {
        top: ((bottomLeftCell.row - bounds.minRow + 1) * (cellSize + cellGap)),
        left: ((bottomLeftCell.col - bounds.minCol + 0.5) * (cellSize + cellGap)),
      };
    }
    return null;
  }, [puzzle.shapeTemplate, region.id, bottomLeftCell, bounds, cellSize, cellGap]);

  return (
    <>
      {/* Region background layer - above tan squares but below cells */}
      <div
        key={`region-bg-${region.id}`}
        className="absolute inset-0 pointer-events-none"
        style={{ zIndex: 9 }}
      >
        {region.cells.map(cell => {
          const relativeRow = cell.row - bounds.minRow;
          const relativeCol = cell.col - bounds.minCol;
          return (
            <div
              key={`bg-${cell.row}-${cell.col}`}
              style={{
                position: 'absolute',
                top: `${relativeRow * (cellSize + cellGap)}px`,
                left: `${relativeCol * (cellSize + cellGap)}px`,
                width: `${cellSize}px`,
                height: `${cellSize}px`,
                backgroundColor: templateColor.bg,
                opacity: 0.85,
                borderRadius: '0.5rem', // More rounded edges
              }}
            />
          );
        })}
      </div>

      {/* Region borders layer */}
      <div
        key={`region-border-${region.id}`}
        className="absolute inset-0 pointer-events-none z-15"
      >
        {region.cells.map(cell => {
          const edgeInfo = getRegionEdgeInfo(
            cell.row,
            cell.col,
            region.id,
            allRegions,
            puzzle
          );
          
          const relativeRow = cell.row - bounds.minRow;
          const relativeCol = cell.col - bounds.minCol;
          const borderWidth = '1.5px';
          const isOuterTL = isOuterCorner(cell.row, cell.col, region.id, allRegions, 'tl', puzzle);
          const isOuterTR = isOuterCorner(cell.row, cell.col, region.id, allRegions, 'tr', puzzle);
          const isOuterBL = isOuterCorner(cell.row, cell.col, region.id, allRegions, 'bl', puzzle);
          const isOuterBR = isOuterCorner(cell.row, cell.col, region.id, allRegions, 'br', puzzle);
          
          // More rounded corners
          const borderRadius = `${isOuterTL ? '0.5rem' : '0'} ${isOuterTR ? '0.5rem' : '0'} ${isOuterBR ? '0.5rem' : '0'} ${isOuterBL ? '0.5rem' : '0'}`;
          
          return (
            <div
              key={`border-${cell.row}-${cell.col}`}
              className="border-dashed print:border-solid"
              style={{
                position: 'absolute',
                top: `${relativeRow * (cellSize + cellGap)}px`,
                left: `${relativeCol * (cellSize + cellGap)}px`,
                width: `${cellSize}px`,
                height: `${cellSize}px`,
                borderTopWidth: edgeInfo.top ? borderWidth : '0',
                borderRightWidth: edgeInfo.right ? borderWidth : '0',
                borderBottomWidth: edgeInfo.bottom ? borderWidth : '0',
                borderLeftWidth: edgeInfo.left ? borderWidth : '0',
                borderColor: templateColor.border,
                borderRadius,
                // Glow effect - remove for print
                boxShadow: edgeInfo.top || edgeInfo.right || edgeInfo.bottom || edgeInfo.left
                  ? `0 0 8px ${templateColor.glow}`
                  : 'none',
              }}
            />
          );
        })}
      </div>

      {/* Rule badge - capsule style */}
      {ruleAnchorPosition && (
        <RegionBadge
          rule={region.rule}
          color={templateColor}
          position={ruleAnchorPosition}
          cellSize={cellSize}
        />
      )}
    </>
  );
};

export default memo(RegionComponent);

