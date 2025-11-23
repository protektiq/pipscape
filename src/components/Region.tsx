import type { Region } from '../types/puzzle';
import { getRegionColor, getRegionEdgeInfo, isOuterCorner, getBottomLeftCell } from '../engine/regionUtils';
import { formatRuleLabel } from '../engine/ruleUtils';

interface RegionProps {
  region: Region;
  gridSize: number;
  allRegions: Region[];
}

const RegionComponent = ({ region, gridSize, allRegions }: RegionProps) => {
  const color = getRegionColor(region.id);
  const label = formatRuleLabel(region.rule);
  const bottomLeftCell = getBottomLeftCell(region);

  return (
    <>
      {/* Region background layer */}
      <div
        key={`region-bg-${region.id}`}
        className="absolute inset-0 pointer-events-none"
      >
        {region.cells.map(cell => {
          const cellSize = `calc(100% / ${gridSize})`;
          return (
            <div
              key={`bg-${cell.row}-${cell.col}`}
              style={{
                position: 'absolute',
                top: `${(cell.row / gridSize) * 100}%`,
                left: `${(cell.col / gridSize) * 100}%`,
                width: cellSize,
                height: cellSize,
                backgroundColor: color.bg,
                opacity: 0.2,
              }}
            />
          );
        })}
      </div>

      {/* Region borders layer */}
      <div
        key={`region-border-${region.id}`}
        className="absolute inset-0 pointer-events-none"
      >
        {region.cells.map(cell => {
          const edgeInfo = getRegionEdgeInfo(
            cell.row,
            cell.col,
            region.id,
            allRegions,
            gridSize
          );
          
          const cellSize = `calc(100% / ${gridSize})`;
          const borderWidth = '2px';
          const isOuterTL = isOuterCorner(cell.row, cell.col, region.id, allRegions, 'tl', gridSize);
          const isOuterTR = isOuterCorner(cell.row, cell.col, region.id, allRegions, 'tr', gridSize);
          const isOuterBL = isOuterCorner(cell.row, cell.col, region.id, allRegions, 'bl', gridSize);
          const isOuterBR = isOuterCorner(cell.row, cell.col, region.id, allRegions, 'br', gridSize);
          
          return (
            <div
              key={`border-${cell.row}-${cell.col}`}
              className="border-dashed"
              style={{
                position: 'absolute',
                top: `${(cell.row / gridSize) * 100}%`,
                left: `${(cell.col / gridSize) * 100}%`,
                width: cellSize,
                height: cellSize,
                borderTopWidth: edgeInfo.top ? borderWidth : '0',
                borderRightWidth: edgeInfo.right ? borderWidth : '0',
                borderBottomWidth: edgeInfo.bottom ? borderWidth : '0',
                borderLeftWidth: edgeInfo.left ? borderWidth : '0',
                borderColor: color.border,
                borderRadius: `${isOuterTL ? '0.375rem' : '0'} ${isOuterTR ? '0.375rem' : '0'} ${isOuterBR ? '0.375rem' : '0'} ${isOuterBL ? '0.375rem' : '0'}`,
              }}
            />
          );
        })}
      </div>

      {/* Rule badge */}
      {bottomLeftCell && (
        <div
          key={`badge-${region.id}`}
          className="absolute pointer-events-none z-20"
          style={{
            top: `${((bottomLeftCell.row + 1) / gridSize) * 100}%`,
            left: `${(bottomLeftCell.col / gridSize) * 100}%`,
            transform: 'translate(-50%, -50%)',
          }}
        >
          <div 
            className="w-5 h-5 sm:w-6 sm:h-6 rounded-md text-white transform rotate-45 flex items-center justify-center shadow-md"
            style={{
              backgroundColor: color.bg,
            }}
          >
            <span className="transform -rotate-45 text-[10px] sm:text-xs font-bold">
              {label}
            </span>
          </div>
        </div>
      )}
    </>
  );
};

export default RegionComponent;

