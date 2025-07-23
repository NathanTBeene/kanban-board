import { createContext, useState } from "react";
import { FaPlus } from "react-icons/fa6";
import { FaPrint } from "react-icons/fa6";
import type { ColumnData, EntryData } from "../lib/data/types";
import Column from "./Columns/Column";
import { useBoardManager } from "../lib/services/BoardManager";
import { DndContext, DragOverlay } from "@dnd-kit/core";
import { SortableContext } from "@dnd-kit/sortable";
import Entry from "./Entry";

export const BoardContext = createContext<ReturnType<
  typeof useBoardManager
> | null>(null);

const Board = () => {
  const manager = useBoardManager();
  const [addHover, setAddHover] = useState(false);
  const [printHover, setPrintHover] = useState(false);

  const onDragStart = (event: any) => {
    const { active } = event;

    if (active.id.startsWith("column-")) {
      onColumnDragStart(event);
    }

    if (active.id.startsWith("entry-")) {
      onEntryDragStart(event);
    }
  };

  const onDragOver = (event: any) => {
    const { active, over } = event;

    if (!over) return;
    if (over.id.startsWith("column-")) {
      console.log("Over a column");
      const activeColumnId = manager.getEntryColumnId(active.id);
      const overColumnId = over.id;

      if (activeColumnId !== overColumnId) {
        manager.switchEntryColumns(
          activeColumnId as string,
          overColumnId as string,
          active.id
        );
      }
      return;
    }

    const activeColumn = manager.getEntryColumnId(active.id);
    const overColumn = manager.getEntryColumnId(over.id);

    if (activeColumn !== overColumn) {
      manager.switchEntryColumns(
        activeColumn as string,
        overColumn as string,
        active.id
      );
    }
  };

  const onDragEnd = (event: any) => {
    const { active, over } = event;

    if (!over) return;

    if (active.id.startsWith("column-")) {
      onColumnDragEnd(event);
      return;
    }

    if (active.id.startsWith("entry-")) {
      onEntryDragEnd(event);
      return;
    }
  };

  const onColumnDragStart = (event: any) => {
    const { active } = event;
    manager.setActiveColumnId(active.id);
  };

  const onColumnDragEnd = (event: any) => {
    const { active, over } = event;

    if (!over) return;

    const activeColumn = manager.getColumnIndex(active.id);
    const overColumn = manager.getColumnIndex(over.id);

    if (activeColumn !== overColumn) {
      manager.switchColumns(activeColumn, overColumn);
    }

    manager.setActiveColumnId(null);
  };

  const onEntryDragStart = (event: any) => {
    const { active } = event;
    manager.setActiveEntryId(active.id);
  };

  const onEntryDragEnd = (event: any) => {
    const { active, over } = event;

    if (!over) return;

    const activeColumn = manager.getEntryColumnId(active.id);
    const overColumn = manager.getEntryColumnId(over.id);
    const activeIndex = manager.getEntryIndex(
      activeColumn as string,
      active.id
    );
    const overIndex = manager.getEntryIndex(overColumn as string, over.id);

    if (activeIndex != overIndex) {
      manager.switchEntries(activeIndex, overIndex);
    }

    manager.setActiveColumnId(null);
    manager.setActiveEntryId(null);
  };

  return (
    <BoardContext.Provider value={manager}>
      <DndContext
        onDragStart={onDragStart}
        onDragOver={onDragOver}
        onDragEnd={onDragEnd}
      >
        <SortableContext
          items={manager.board.columns.map((column) => column.id)}
        >
          <div className="flex gap-4 p-4 pl-25 w-full mb-auto overflow-y-auto scroll">
            <div className="flex flex-wrap gap-4 flex-1 items-start">
              {manager.board.columns.map((column) => (
                <Column key={column.id} column={column} />
              ))}
            </div>
          </div>
        </SortableContext>
        <DragOverlay>
          {manager.activeColumnId && (
            <Column
              key={manager.activeColumnId}
              column={
                manager.board.columns.find(
                  (column) => column.id === manager.activeColumnId
                ) as ColumnData
              }
            />
          )}
          {manager.activeEntryId && (
            <Entry
              columnId={manager.activeColumnId as string}
              entry={
                manager.board.columns
                  .flatMap((column) => column.items)
                  .find(
                    (entry) => entry.id === manager.activeEntryId
                  ) as EntryData
              }
            />
          )}
        </DragOverlay>
      </DndContext>
      <button
        onMouseEnter={() => setAddHover(true)}
        onMouseLeave={() => setAddHover(false)}
        className={
          `absolute top-8 right-8 bg-slate-700 text-white font-bold h-10 w-10 p-3 rounded-full cursor-pointer flex items-center justify-end text-xl overflow-hidden gap-2
          hover:bg-slate-600 hover:w-35
          transition-all duration-300`
        }
        onClick={() => manager.addColumn("Column")}
      >
        {addHover ? <span className={`text-sm inline whitespace-nowrap overflow-hidden`}>Add Column</span> : null}
        <FaPlus />
      </button>
      <button
        onMouseEnter={() => setPrintHover(true)}
        onMouseLeave={() => setPrintHover(false)}
        className={
          `absolute top-20 right-8 bg-slate-700 text-white font-bold h-10 w-10 p-3 rounded-full cursor-pointer flex items-center justify-end text-xl overflow-hidden gap-2
          hover:bg-slate-600 hover:w-40
          transition-all duration-300`
        }
        onClick={() => console.log(manager.board.columns)}
      >
        {printHover ? <span className={`text-sm inline whitespace-nowrap overflow-hidden`}>Log Board Data</span> : null}
        <FaPrint />
      </button>
    </BoardContext.Provider>
  );
};

export default Board;
