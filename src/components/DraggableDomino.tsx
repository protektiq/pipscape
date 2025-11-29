import { useDraggable } from '@dnd-kit/core';
import type { ReactNode } from 'react';

type DragSource = { type: 'tray'; dominoId: string } | { type: 'board'; placementId: string };

interface DraggableDominoProps {
  id: string;
  data: DragSource;
  children: ReactNode;
  disabled?: boolean;
  className?: string;
}

const DraggableDomino = ({ id, data, children, disabled = false, className = '' }: DraggableDominoProps) => {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id,
    data,
    disabled,
  });

  const style = transform
    ? {
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
      }
    : undefined;

  return (
    <div
      ref={setNodeRef}
      style={{
        ...style,
        touchAction: 'none', // Prevent default touch behaviors (scrolling, zooming) during drag
      }}
      {...listeners}
      {...attributes}
      className={`${className} ${isDragging ? 'opacity-50 z-50' : ''}`}
    >
      {children}
    </div>
  );
};

export default DraggableDomino;

