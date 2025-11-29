import { useDroppable } from '@dnd-kit/core';
import type { ReactNode, CSSProperties } from 'react';

interface DroppableCellProps {
  id: string;
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
}

const DroppableCell = ({ id, children, className = '', style }: DroppableCellProps) => {
  const { setNodeRef, isOver } = useDroppable({
    id,
  });

  return (
    <div
      ref={setNodeRef}
      className={`${className} ${isOver ? 'bg-blue-100 ring-2 ring-blue-400' : ''}`}
      style={style}
    >
      {children}
    </div>
  );
};

export default DroppableCell;

