import { useDroppable } from '@dnd-kit/core';
import type { ReactNode } from 'react';

interface DroppableCellProps {
  id: string;
  children: ReactNode;
  className?: string;
}

const DroppableCell = ({ id, children, className = '' }: DroppableCellProps) => {
  const { setNodeRef, isOver } = useDroppable({
    id,
  });

  return (
    <div
      ref={setNodeRef}
      className={`${className} ${isOver ? 'bg-blue-100 ring-2 ring-blue-400' : ''}`}
    >
      {children}
    </div>
  );
};

export default DroppableCell;

