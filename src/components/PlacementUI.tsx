import type { ReactNode } from 'react';
import { usePuzzleStore } from '../store/puzzleStore';

interface PlacementUIProps {
  children: ReactNode;
}

const PlacementUI = ({ children }: PlacementUIProps) => {
  const { placementMode, clearSelection } = usePuzzleStore();

  // Allow clicking outside to cancel placement
  const handleClickOutside = (e: React.MouseEvent) => {
    if (placementMode !== 'select-domino' && e.target === e.currentTarget) {
      clearSelection();
    }
  };

  return (
    <div onClick={handleClickOutside} className="w-full">
      {children}
    </div>
  );
};

export default PlacementUI;

