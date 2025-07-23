import { useState, useEffect, useRef } from "react";
import type { Id, BoardData, ColumnData, EntryData } from "../data/types";

const initialBoardData: BoardData = {
  id: 1,
  columns: [
    {
      id: "column-todo",
      title: "To Do",
      items: [
        { id: "entry-101", description: "Set up project structure" },
        { id: "entry-102", description: "Design board layout" },
      ],
    },
    {
      id: "column-in-progress",
      title: "In Progress",
      items: [
        { id: "entry-201", description: "Implement column component" },
      ],
    },
    {
      id: "column-done",
      title: "Done",
      items: [
        { id: "entry-301", description: "Initialize repository" },
      ],
    },
  ],
};

export function useBoardManager() {
  const [board, setBoard] = useState<BoardData>({id: 1, columns: []} as BoardData);
  const [activeColumnId, setActiveColumnId] = useState<Id | null>(null);
  const [activeEntryId, setActiveEntryId] = useState<Id | null>(null);
  const loaded = useRef(false);

  // Load board data from localStorage
  useEffect(() => {
    const data = localStorage.getItem("kanban-board");
    if (data) {
      setBoard(JSON.parse(data) as BoardData);
    } else {
      setBoard(initialBoardData);
    }
    loaded.current = true;
  }, []);

  // Save board data to localStorage
  useEffect(() => {
    if (loaded.current && board.columns.length > 0) {
      localStorage.setItem("kanban-board", JSON.stringify(board, null, 2));
    }
  }, [board]);

  const swapIndexes = (array: any[], fromIndex: number, toIndex: number) => {
    const newArray = [...array];
    const [movedItem] = newArray.splice(fromIndex, 1);
    newArray.splice(toIndex, 0, movedItem);
    return newArray;
  };

  const switchColumns = (fromIndex: number, toIndex: number) => {
    setBoard((prevBoard) => {
      const columns = swapIndexes(prevBoard.columns, fromIndex, toIndex);
      return { ...prevBoard, columns };
    });
  };

  const getColumnIndex = (columnId: Id): number => {
    return board.columns.findIndex((column) => column.id === columnId);
  };

  const addColumn = (title: string) => {
    const newColumn: ColumnData = {
      id: `column-${Date.now().toString()}` as Id,
      title,
      items: [],
    };
    setBoard((prevBoard) => ({
      ...prevBoard,
      columns: [...prevBoard.columns, newColumn],
    }));
  };

  const removeColumn = (columnId: Id) => {
    setBoard((prevBoard) => ({
      ...prevBoard,
      columns: prevBoard.columns.filter((column) => column.id !== columnId),
    }));
  };

  const updateColumnTitle = (columnId: Id, newTitle: string) => {
    setBoard((prevBoard) => ({
      ...prevBoard,
      columns: prevBoard.columns.map((column) =>
        column.id === columnId ? { ...column, title: newTitle } : column
      ),
    }));
  };

  const buildEntry = (description: string): EntryData => {
    return {
      id: `entry-${Date.now().toString()}` as Id,
      description,
    };
  };

  const addEntry = (columnId: Id, entry: EntryData) => {
    setBoard((prevBoard) => ({
      ...prevBoard,
      columns: prevBoard.columns.map((column) =>
        column.id === columnId
          ? { ...column, items: [...column.items, entry] }
          : column
      ),
    }));
  };

  const removeEntry = (columnId: Id, entryId: Id) => {
    setBoard((prevBoard) => ({
      ...prevBoard,
      columns: prevBoard.columns.map((column) =>
        column.id === columnId
          ? {
              ...column,
              items: column.items.filter((item) => item.id !== entryId),
            }
          : column
      ),
    }));
  };

  const editEntry = (columnId: Id, entryId: Id, newDescription: string) => {
    setBoard((prevBoard) => ({
      ...prevBoard,
      columns: prevBoard.columns.map((column) =>
        column.id === columnId
          ? {
              ...column,
              items: column.items.map((item) =>
                item.id === entryId
                  ? { ...item, description: newDescription }
                  : item
              ),
            }
          : column
      ),
    }));
  };

  const getEntryColumnId = (entryId: Id): Id | null => {
    for (const column of board.columns) {
      if (column.items.some((item) => item.id === entryId)) {
        return column.id;
      }
    }
    return null;
  };

  const getEntryIndex = (columnId: Id, entryId: Id): number => {
    const column = board.columns.find((col) => col.id === columnId);
    if (!column) return -1;
    return column.items.findIndex((item) => item.id === entryId);
  };

  const switchEntryColumns = (
    fromColumnId: Id,
    toColumnId: Id,
    entryId: Id
  ) => {
    setBoard((prevBoard) => {
      const columns = [...prevBoard.columns];
      const fromColumn = columns.find((column) => column.id === fromColumnId);
      const toColumn = columns.find((column) => column.id === toColumnId);

      if (!fromColumn || !toColumn) return prevBoard;

      const entry = fromColumn.items.find((item) => item.id === entryId);
      if (!entry) return prevBoard;

      // Remove entry from the original column
      fromColumn.items = fromColumn.items.filter((item) => item.id !== entryId);
      // Add entry to the new column
      toColumn.items.push(entry);

      return { ...prevBoard, columns };
    });
  };

  // Assumes they are in the same column
  const switchEntries = (fromIndex: number, toIndex: number) => {
    setBoard((prevBoard) => {
      const columnId = getEntryColumnId(activeEntryId as Id);
      const columns = prevBoard.columns.map((column) => {
        if (column.id === columnId) {
          return {
            ...column,
            items: swapIndexes(column.items, fromIndex, toIndex),
          };
        }
        return column;
      });
      return { ...prevBoard, columns };
    });
  };

  return {
    board,
    setBoard,
    activeColumnId,
    setActiveColumnId,
    activeEntryId,
    setActiveEntryId,
    addColumn,
    removeColumn,
    updateColumnTitle,
    buildEntry,
    addEntry,
    removeEntry,
    editEntry,
    switchColumns,
    getColumnIndex,
    getEntryColumnId,
    switchEntryColumns,
    switchEntries,
    getEntryIndex,
  };
}
