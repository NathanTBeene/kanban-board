import { useSortable } from "@dnd-kit/sortable";

interface SortableProps {
  element?: React.ElementType;
  id: string | number;
  children: React.ReactNode;
}

const Sortable = ({element, id, children}: SortableProps) => {
  const Element = element || 'div';
  const {attributes, listeners, setNodeRef, transform, transition, isDragging} = useSortable({
    id: id
  });

  const style = {
    opacity: isDragging ? 0 : 1,
    transform: transform ? `translate3d(${transform.x}px, ${transform.y}px, 0)` : undefined,
    transition: transition,
    cursor: isDragging ? 'grabbing' : 'grab',
  };

  return (
    <Element ref={setNodeRef} {...listeners} {...attributes} style={style}>
      {children}
    </Element>
  )
}

export default Sortable