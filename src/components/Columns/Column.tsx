import Entry from "../Entry";
import Footer from "./Footer";
import Header from "./Header";
import type { ColumnData } from "../../lib/data/types";
import { useSortable } from "@dnd-kit/sortable";
import { SortableContext } from "@dnd-kit/sortable";
import { BoardContext } from "../Board";
import { useContext } from "react";

const Column = ({ column }: { column: ColumnData }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: column.id,
  });

  const style = {
    opacity: isDragging ? 0 : 1,
    transform: transform
      ? `translate3d(${transform.x}px, ${transform.y}px, 0)`
      : undefined,
    transition: transition,
  };

  const context = useContext(BoardContext);
  if (!context) {
    throw new Error("BoardContext is not available");
  }

  return (
    <div
      ref={setNodeRef}
      className="min-w-[250px] min-h-[100px] max-w-[330px] bg-slate-800 rounded-lg shadow-md border-1 border-slate-700 flex flex-col h-fit"
      style={style}
    >
      <Header
        id={column.id}
        title={column.title}
        length={column.items.length}
        sortable={{ attributes, listeners, isDragging }}
      />

      {/* Items */}
      <SortableContext items={column.items.map((item) => item.id)}>
        <div className="p-2 flex flex-1 flex-col gap-2">
          {column.items.map((item) => (
            <Entry key={item.id} columnId={column.id} entry={item} />
          ))}
        </div>
      </SortableContext>

      <Footer columnId={column.id} />
    </div>
  );
};

export default Column;
